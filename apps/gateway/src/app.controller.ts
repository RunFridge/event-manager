import { Controller, Get, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { AliveResponseDto } from "./dtos/alive-response.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("일반")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * MSA 서버의 상태를 확인합니다.
   */
  @UseGuards(JwtAuthGuard)
  @Get("alive")
  async checkAlive(): Promise<AliveResponseDto> {
    return this.appService.alive();
  }
}
