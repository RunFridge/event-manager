import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { timestampToDate } from "@utils/date";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { UserDto } from "../dtos/user.dto";
import { ApiTags } from "@nestjs/swagger";
import { AuthRequestDto } from "../dtos/auth-request.dto";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 신규 유저를 등록합니다.
   * @description `active` 필드는 기본적으로 false로 등록됩니다.
   */
  @Post("register")
  async register(@Body() request: AuthRequestDto): Promise<UserDto> {
    const registerObservable = this.authService.register(request);
    const { result, message, userResponse } =
      await firstValueFrom(registerObservable);
    if (!result) throw new BadRequestException(message);
    if (!userResponse) throw new BadRequestException(message);

    return {
      id: userResponse.userId,
      role: userResponse.role,
      username: userResponse.username,
      active: userResponse.active,
      createdAt: timestampToDate(userResponse.createdAt!),
      updatedAt: timestampToDate(userResponse.updatedAt!),
    };
  }

  /**
   * 로그인하여 토큰을 받습니다.
   */
  @Post("login")
  async login(@Body() request: AuthRequestDto): Promise<LoginResponseDto> {
    const loginObservable = this.authService.login(request);
    const { result, message, tokenResponse } =
      await firstValueFrom(loginObservable);
    if (!result) throw new BadRequestException(message);
    if (!tokenResponse) throw new BadRequestException(message);
    return { ...tokenResponse };
  }
}
