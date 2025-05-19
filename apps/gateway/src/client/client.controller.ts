import { Controller, Get, Post } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ClientService } from "./client.service";
import { Roles } from "../roles/role.decorator";
import { Role } from "../roles/role.enum";

@ApiTags("사용자 보상 관련")
@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  /**
   * 이벤트 보상 지급 요청
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Post("event/:eventId/claim")
  async claimEventReward() {}

  /**
   * 사용자 프로필 조회
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Get()
  async getClientProfile() {}

  /**
   * 사용자 보상 지급 목록 조회
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Get("reward")
  async listRewardHistory() {}

  /**
   * 진행중 이벤트 목록 조회
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Get("event")
  async listActiveEvents() {}
}
