import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { AppService } from "./app.service";
import { AuthRequest } from "proto/auth";
import { AliveResponseDto } from "./dtos/AliveResponse.dto";
import { RegisterResponseDto } from "./dtos/RegisterResponse.dto";
import { timestampToDate } from "@utils/date";
import { LoginResponseDto } from "./dtos/LoginRespons.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get("alive")
  async checkAlive(): Promise<AliveResponseDto> {
    return this.appService.alive();
  }

  @Post("register")
  async register(@Body() request: AuthRequest): Promise<RegisterResponseDto> {
    const registerObservable = this.appService.register(request);
    const { result, message, registerResponse } =
      await firstValueFrom(registerObservable);
    if (!result) throw new BadRequestException(message);
    if (!registerResponse) throw new BadRequestException(message);

    return {
      role: registerResponse.role,
      username: registerResponse.username,
      active: registerResponse.active,
      createdAt: timestampToDate(registerResponse.createdAt!),
      updatedAt: timestampToDate(registerResponse.updatedAt!),
    };
  }

  @Post("login")
  async login(@Body() request: AuthRequest): Promise<LoginResponseDto> {
    const loginObservable = this.appService.login(request);
    const { result, message, tokenResponse } =
      await firstValueFrom(loginObservable);
    if (!result) throw new BadRequestException(message);
    if (!tokenResponse) throw new BadRequestException(message);
    return { ...tokenResponse };
  }
}
