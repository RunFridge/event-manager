import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { timestampToDate } from "@utils/date";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { UserDto } from "../dtos/user.dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./public.decorator";
import { LoginRequestDto } from "../dtos/login-request.dto";
import { RegisterRequestDto } from "../dtos/register-request.dto";
import { Roles } from "../roles/role.decorator";
import { Role } from "../roles/role.enum";
import { RefreshTokenRequestDto } from "../dtos/refreh-token-request.dto";
import { parseAuthorizationHeader } from "@utils/header";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 신규 유저를 등록합니다.
   * @description `active` 필드는 기본적으로 false로 등록됩니다.
   */
  @Public()
  @Post("register")
  async register(@Body() request: RegisterRequestDto): Promise<UserDto> {
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
  @Public()
  @Post("login")
  async login(@Body() request: LoginRequestDto): Promise<LoginResponseDto> {
    const loginObservable = this.authService.login(request);
    const { result, message, tokenResponse } =
      await firstValueFrom(loginObservable);
    if (!result) throw new BadRequestException(message);
    if (!tokenResponse) throw new BadRequestException(message);
    return { ...tokenResponse };
  }

  /**
   * 토큰을 갱신합니다.
   */
  @Roles(Role.ALL)
  @Post("refresh-token")
  async refreshToken(
    @Headers("Authoirzation") authorizationHeader: string,
    @Body() request: RefreshTokenRequestDto,
  ): Promise<LoginResponseDto> {
    const accessToken = parseAuthorizationHeader(authorizationHeader);
    const refreshTokenObservable = this.authService.refreshToken(
      accessToken,
      request.refreshToken,
    );
    const { result, message, tokenResponse } = await firstValueFrom(
      refreshTokenObservable,
    );
    if (!result) throw new BadRequestException(message);
    if (!tokenResponse) throw new BadRequestException(message);
    return { ...tokenResponse };
  }

  /**
   * 로그아웃합니다.
   */
  @Roles(Role.ALL)
  @Post("logout")
  logout(
    @Headers("Authoirzation") authorizationHeader: string,
    @Body() request: RefreshTokenRequestDto,
  ) {
    const accessToken = parseAuthorizationHeader(authorizationHeader);
    this.authService.logout(accessToken, request.refreshToken);
  }
}
