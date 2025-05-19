import { hash, compare } from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "@config/env.schema";
import { USER_MODEL } from "@constants/mongo";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "@constants/token";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "database/schemas/user.schema";
import { Model } from "mongoose";
import {
  ActivateUserRequest,
  AssignRoleRequest,
  LoginRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  CommonResponse,
  ListUserRequest,
  UserListResponse,
  RegisterRequest,
  GetUserRequest,
  TokenRequest,
} from "proto/auth";
import { dateToTimestamp, timestampToDate } from "@utils/date";
import { JwtPayload } from "apps/gateway/src/auth/jwt-payload.interface";
import { Role, roleFrom } from "apps/gateway/src/roles/role.enum";
import { hashify } from "@utils/random";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(USER_MODEL) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private tokenStore: Cache,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = this.config.get<string>(BCRYPT_SALT_ROUNDS)!;
    return await hash(password, salt);
  }

  async register(request: RegisterRequest): Promise<CommonResponse> {
    const existingUser = await this.userModel.findOne({
      username: request.username,
    });
    if (existingUser) {
      return { result: false, message: "duplicate username exists" };
    }
    const encryptedPassword = await this.hashPassword(request.password);
    const birthday = request.birthday
      ? timestampToDate(request.birthday)
      : undefined;
    const createdUser = await this.userModel.create({
      username: request.username,
      password: encryptedPassword,
      birthday,
      active: false,
      role: "user",
      condition: {
        loginStreakDays: 0,
        referralCount: 0,
      },
    });

    if (request.referral) {
      await this.userModel.findOneAndUpdate(
        { username: request.referral },
        { $inc: { "condition.referralCount": 1 } },
      );
    }

    return {
      result: true,
      userResponse: {
        userId: createdUser._id.toString(),
        role: createdUser.role,
        username: createdUser.username,
        active: createdUser.active,
        birthday: createdUser.birthday
          ? dateToTimestamp(createdUser.birthday)
          : undefined,
        createdAt: dateToTimestamp(createdUser.createdAt),
        updatedAt: dateToTimestamp(createdUser.updatedAt),
        lastLoginAt: undefined,
      },
    };
  }

  private getMidnightDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private computeLoginStreak(
    previousLoginStreak: number,
    now: Date,
    lastLoginDate?: Date,
  ): number {
    if (!lastLoginDate) return 1;
    const nowMidnight = this.getMidnightDate(now);
    const lastMidnight = this.getMidnightDate(lastLoginDate);
    if (nowMidnight.getTime() === lastMidnight.getTime())
      return previousLoginStreak;
    const diffTime = nowMidnight.getTime() - lastMidnight.getTime();
    const oneDayMs = 24 * 60 * 60 * 1_000;
    if (diffTime > oneDayMs) return previousLoginStreak++;
    return previousLoginStreak;
  }

  async login(request: LoginRequest): Promise<CommonResponse> {
    try {
      const user = await this.userModel.findOne({
        username: request.username,
      });
      if (!user) {
        return {
          result: false,
          message: "username not found",
        };
      }
      if (!user.active) {
        return {
          result: false,
          message: "user not activated",
        };
      }

      const isPasswordCorrect = await compare(request.password, user.password);
      if (!isPasswordCorrect) {
        return { result: false, message: "invalid password" };
      }
      const payload: JwtPayload = {
        username: user.username,
        role: roleFrom(user.role),
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const refreshToken = hashify(user.username + Date.now());
      this.tokenStore.set(
        user.username,
        refreshToken,
        REFRESH_TOKEN_EXPIRES_IN,
      );

      const lastLoginDate = user.lastLoginAt;
      const now = new Date();

      const loginStreakDays = this.computeLoginStreak(
        user.condition.loginStreakDays,
        now,
        lastLoginDate,
      );
      await this.userModel.updateOne(
        { _id: user._id },
        { lastLoginAt: now, condition: { loginStreakDays } },
      );

      return {
        result: true,
        tokenResponse: {
          accessToken,
          accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
          refreshToken,
          refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
        },
      };
    } catch (error: unknown) {
      Logger.log(error, AuthController.name);
      return {
        result: false,
        message: "Unknown error",
      };
    }
  }

  async refreshToken(request: TokenRequest): Promise<CommonResponse> {
    const { accessToken, refreshToken } = request;
    const payload = this.jwtService.verify<JwtPayload>(accessToken, {
      ignoreExpiration: true,
    });
    if (!payload || !payload.username) {
      return { result: false, message: "invalid access token" };
    }
    const tokenStoreRefreshToken = await this.tokenStore.get<string>(
      payload.username,
    );
    if (!tokenStoreRefreshToken || tokenStoreRefreshToken !== refreshToken) {
      return { result: false, message: "invalid refresh token" };
    }
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const newRefreshToken = hashify(payload.username + Date.now());
    return {
      result: true,
      tokenResponse: {
        accessToken: newAccessToken,
        accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
        refreshToken: newRefreshToken,
        refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    };
  }

  async revokeToken(request: TokenRequest): Promise<CommonResponse> {
    const { accessToken } = request;
    const payload = this.jwtService.verify<JwtPayload>(accessToken, {
      ignoreExpiration: true,
    });
    if (!payload || !payload.username) {
      return { result: false, message: "invalid access token" };
    }
    await this.tokenStore.del(payload.username);
    return {
      result: true,
      message: "token revoked",
    };
  }

  async assignRole(request: AssignRoleRequest): Promise<CommonResponse> {
    const role = roleFrom(request.role);
    if (role === Role.INVALID) {
      return { result: false, message: "invalid role" };
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: request.userId },
      { role, updatedAt: new Date() },
      { new: true },
    );
    if (!updatedUser) {
      return {
        result: false,
        message: "user not found",
      };
    }
    return {
      result: true,
      userResponse: {
        userId: updatedUser._id.toString(),
        role: updatedUser.role,
        username: updatedUser.username,
        active: updatedUser.active,
        birthday: updatedUser.birthday
          ? dateToTimestamp(updatedUser.birthday)
          : undefined,
        createdAt: dateToTimestamp(updatedUser.createdAt),
        updatedAt: dateToTimestamp(updatedUser.updatedAt),
        lastLoginAt: updatedUser.lastLoginAt
          ? dateToTimestamp(updatedUser.lastLoginAt)
          : undefined,
      },
    };
  }

  async activateUser(request: ActivateUserRequest): Promise<CommonResponse> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: request.userId },
      { active: true, updatedAt: new Date() },
      { new: true },
    );
    if (!updatedUser) {
      return {
        result: false,
        message: "user not found",
      };
    }
    return {
      result: true,
      userResponse: {
        userId: updatedUser._id.toString(),
        role: updatedUser.role,
        username: updatedUser.username,
        active: updatedUser.active,
        birthday: updatedUser.birthday
          ? dateToTimestamp(updatedUser.birthday)
          : undefined,
        createdAt: dateToTimestamp(updatedUser.createdAt),
        updatedAt: dateToTimestamp(updatedUser.updatedAt),
        lastLoginAt: updatedUser.lastLoginAt
          ? dateToTimestamp(updatedUser.lastLoginAt)
          : undefined,
      },
    };
  }

  async listUsers(request: ListUserRequest): Promise<UserListResponse> {
    const { page = 1, limit = 10, filterActive } = request;
    const offset = (page - 1) * limit;
    const filter = filterActive ? { active: true } : {};
    const rawList = await this.userModel
      .find(filter)
      .select({ password: 0, condition: 0, inventory: 0 })
      .skip(offset)
      .limit(limit);
    const total = await this.userModel.countDocuments(filter);
    return {
      page,
      limit,
      filterActive,
      total,
      list: rawList.map((u) => ({
        userId: u._id.toString(),
        username: u.username,
        active: u.active,
        role: u.role,
        birthday: u.birthday ? dateToTimestamp(u.birthday) : undefined,
        createdAt: dateToTimestamp(u.createdAt),
        updatedAt: dateToTimestamp(u.updatedAt),
        lastLoginAt: u.lastLoginAt ? dateToTimestamp(u.lastLoginAt) : undefined,
      })),
    };
  }

  async getUser(request: GetUserRequest): Promise<CommonResponse> {
    const { userId } = request;
    const user = await this.userModel.findById(userId).select({ password: 0 });
    if (!user) {
      return {
        result: false,
        message: "user not found",
      };
    }
    return {
      result: true,
      message: "hello",
      userResponse: {
        userId: user._id.toString(),
        role: user.role,
        username: user.username,
        active: user.active,
        birthday: user.birthday ? dateToTimestamp(user.birthday) : undefined,
        createdAt: dateToTimestamp(user.createdAt),
        updatedAt: dateToTimestamp(user.updatedAt),
        lastLoginAt: user.lastLoginAt
          ? dateToTimestamp(user.lastLoginAt)
          : undefined,
        condition: {
          loginStreakDays: user.condition.loginStreakDays,
          referralCount: user.condition.referralCount,
        },
        inventory: {
          point: user.inventory.point,
          items: user.inventory.items,
          coupons: user.inventory.coupons,
        },
      },
    };
  }
}
