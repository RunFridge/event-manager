import { Controller, Get, Headers, Param, Post, Query } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Roles } from "../roles/role.decorator";
import { Role } from "../roles/role.enum";
import { EventListQueryDto } from "../dtos/event-list-query.dto";
import { EventListDto } from "../dtos/event.dto";
import { firstValueFrom } from "rxjs";
import { timestampToDate } from "@utils/date";
import { EventService } from "../event/event.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../auth/jwt-payload.interface";
import { parseAuthorizationHeader } from "@utils/header";
import { CommonResponseDto } from "../dtos/common-response.dto";
import { AuditService } from "../audit/audit.service";
import { AuditListQueryDto } from "../dtos/audit-list-query.dto";
import { AuditListDto } from "../dtos/audit.dto";

@ApiTags("사용자 보상 관련")
@Controller("client")
export class ClientController {
  constructor(
    private readonly auditService: AuditService,
    private readonly eventService: EventService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 이벤트 보상 지급 요청
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Post("event/:eventId/claim")
  async claimEventReward(
    @Headers("Authoirzation") authorizationHeader: string,
    @Param("eventId") eventId: string,
  ): Promise<CommonResponseDto> {
    const { username } = await this.jwtService.verifyAsync<JwtPayload>(
      parseAuthorizationHeader(authorizationHeader),
      { ignoreExpiration: true },
    );
    const claimObservable = this.eventService.claimEventReward({
      eventId,
      username,
    });
    return await firstValueFrom(claimObservable);
  }

  /**
   * 사용자 보상 지급 목록 조회
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Get("reward")
  async listRewardHistory(
    @Headers("Authoirzation") authorizationHeader: string,
    @Query() query: AuditListQueryDto,
  ): Promise<AuditListDto> {
    const { username } = await this.jwtService.verifyAsync<JwtPayload>(
      parseAuthorizationHeader(authorizationHeader),
      { ignoreExpiration: true },
    );
    const listObservable = this.auditService.listAuditReward({
      page: query.page || 1,
      limit: query.limit || 10,
      filterUsername: username,
      filterEventId: query.filterEventId,
    });
    const res = await firstValueFrom(listObservable);
    return {
      page: res.page,
      limit: res.limit,
      total: res.total,
      filterEventId: res.filterEventId,
      filterUsername: res.filterUsername,
      list: res.list?.map((a) => ({
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

  /**
   * 진행중 이벤트 목록 조회
   */
  @Roles(Role.USER)
  @ApiSecurity({ allowed: [Role.USER] })
  @Get("event")
  async listActiveEvents(
    @Query() query: EventListQueryDto,
  ): Promise<EventListDto> {
    const listObservable = this.eventService.listEvents({
      page: query.page || 1,
      limit: query.limit || 10,
      filterType: query.filterType,
      filterActive: true,
    });
    const res = await firstValueFrom(listObservable);
    return {
      page: res.page,
      limit: res.limit,
      total: res.total,
      filterActive: res.filterActive,
      filterType: res.filterType,
      list: res.list?.map((e) => ({
        eventId: e.eventId,
        type: e.type,
        title: e.title,
        active: e.active,
        targetCriteria: e.targetCriteria,
        rewards: [],
        description: e.description,
        createdAt: timestampToDate(e.createdAt!),
        updatedAt: timestampToDate(e.updatedAt!),
      })),
    };
  }
}
