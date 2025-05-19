import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { AliveResponseDto } from "./dtos/alive-response.dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./auth/public.decorator";

@ApiTags("일반")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * MSA 서버의 상태를 확인합니다.
   */
  @Public()
  @Get("alive")
  async checkAlive(): Promise<AliveResponseDto> {
    return this.appService.alive();
  }
}
