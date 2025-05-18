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
  AuthRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  CommonResponse,
  ListUserRequest,
  UserListResponse,
} from "proto/auth";
import { dateToTimestamp } from "@utils/date";
import { JwtPayload } from "apps/gateway/src/auth/jwt-payload.interface";
import { roleFrom } from "apps/gateway/src/roles/role.enum";

@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(USER_MODEL) private userModel: Model<UserDocument>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = this.config.get<string>(BCRYPT_SALT_ROUNDS)!;
    return await hash(password, salt);
  }

  async register(request: AuthRequest): Promise<CommonResponse> {
    const existingUser = await this.userModel.findOne({
      username: request.username,
    });
    if (existingUser) {
      return { result: false, message: "duplicate username exists" };
    }
    const encryptedPassword = await this.hashPassword(request.password);
    const createdUser = await this.userModel.create({
      username: request.username,
      password: encryptedPassword,
      active: false,
      role: "user",
    });
    return {
      result: true,
      userResponse: {
        userId: createdUser._id.toString(),
        role: createdUser.role,
        username: createdUser.username,
        active: createdUser.active,
        createdAt: dateToTimestamp(createdUser.createdAt),
        updatedAt: dateToTimestamp(createdUser.updatedAt),
      },
    };
  }

  async login(request: AuthRequest): Promise<CommonResponse> {
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

      return {
        result: true,
        tokenResponse: {
          accessToken,
          accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
          refreshToken: "",
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

  async assignRole(request: AssignRoleRequest): Promise<CommonResponse> {
    const valid_roles = ["user", "operator", "auditor", "admin"];
    if (!valid_roles.includes(request.role)) {
      return { result: false, message: "invalid role" };
    }
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: request.userId },
      { role: request.role, updatedAt: new Date() },
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
        userId: "",
        role: updatedUser.role,
        username: updatedUser.username,
        active: updatedUser.active,
        createdAt: dateToTimestamp(updatedUser.createdAt),
        updatedAt: dateToTimestamp(updatedUser.updatedAt),
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
        createdAt: dateToTimestamp(updatedUser.createdAt),
        updatedAt: dateToTimestamp(updatedUser.updatedAt),
      },
    };
  }

  async listUsers(request: ListUserRequest): Promise<UserListResponse> {
    const { page = 1, limit = 10, filterActive } = request;
    const offset = (page - 1) * limit;
    const filter = filterActive ? { active: true } : {};
    const rawList = await this.userModel
      .find(filter)
      .select({ password: 0 })
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
        createdAt: dateToTimestamp(u.createdAt),
        updatedAt: dateToTimestamp(u.updatedAt),
      })),
    };
  }
}
