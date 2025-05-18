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
  AuthRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  CommonResponse,
} from "proto/auth";
import { dateToTimestamp } from "@utils/date";

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
      registerResponse: {
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

      const isPasswordCorrect = await compare(request.password, user.password);
      if (!isPasswordCorrect) {
        return { result: false, message: "invalid password" };
      }

      const accessToken = this.jwtService.sign(
        { username: user.username, role: user.role },
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      );

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
}
