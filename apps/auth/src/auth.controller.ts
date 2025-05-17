import { Controller } from "@nestjs/common";
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginRequest,
  LoginResponse,
} from "proto/auth";

@Controller("auth")
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  async login(request: LoginRequest): Promise<LoginResponse> {
    return await new Promise<LoginResponse>((resolve) => {
      resolve({
        token: request.username,
        message: "Login successful",
      });
    });
  }

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    return await new Promise<LogoutResponse>((resolve) => {
      resolve({
        message: `Logout successful: ${request.token}`,
      });
    });
  }
}
