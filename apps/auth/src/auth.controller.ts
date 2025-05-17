import { Controller } from "@nestjs/common";
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginRequest,
  TokenResponse,
} from "proto/auth";

@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  private readonly instanceId = Math.random().toString(36).substring(2, 15);

  login(request: LoginRequest): TokenResponse {
    console.log(
      `[${this.instanceId}] username: ${request.username}, password: ${request.password}`,
    );
    const accessToken = request.username + "@AT";
    const refreshToken = "RT@" + Date.now();
    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresIn: 100,
      accessTokenExpiresIn: 100,
      tokenType: "Bearer",
    };
  }
}
