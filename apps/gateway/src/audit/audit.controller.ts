import { Controller, Get, Query } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuditService } from "./audit.service";
import { AuditListQueryDto } from "../dtos/audit-list-query.dto";
import { AuditListDto } from "../dtos/audit.dto";
import { firstValueFrom } from "rxjs";
import { timestampToDate } from "@utils/date";
import { Roles } from "../roles/role.decorator";
import { Role } from "../roles/role.enum";

@ApiTags("감사 관리")
@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * 보상 이력 조회 (감사)
   */
  @Roles(Role.AUDITOR)
  @ApiSecurity({ allowed: [Role.AUDITOR] })
  @Get("reward")
  async listRewardAudit(
    @Query() query: AuditListQueryDto,
  ): Promise<AuditListDto> {
    const listObservable = this.auditService.listAuditReward({
      page: query.page || 1,
      limit: query.limit || 10,
      filterUsername: query.filterUsername,
      filterEventId: query.filterEventId,
    });
    const res = await firstValueFrom(listObservable);
    return {
      page: res.page,
      limit: res.limit,
      total: res.total,
      filterEventId: res.filterEventId,
      filterUsername: res.filterUsername,
      list: res.list.map((a) => ({
        auditId: a.auditId,
        userId: a.userId,
        username: a.username,
        eventId: a.eventId,
        eventTitle: a.eventTitle,
        claimedRewards: a.claimedRewards.map((r) => ({
          rewardId: r.rewardId,
          type: r.type,
          title: r.title,
          description: r.description,
          active: r.active,
          point: r.point,
          coupons: r.coupons,
          items: r.items,
          createdAt: timestampToDate(r.createdAt!),
          updatedAt: timestampToDate(r.updatedAt!),
        })),
        timestamp: timestampToDate(a.timestamp!),
      })),
    };
  }
}
