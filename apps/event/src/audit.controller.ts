import { AUDIT_MODEL } from "@constants/mongo";
import { Controller, Inject } from "@nestjs/common";
import { dateToTimestamp } from "@utils/date";
import { AuditDocument } from "database/schemas/audit.schema";
import { Model } from "mongoose";
import {
  AuditRewardListResponse,
  AuditServiceController,
  AuditServiceControllerMethods,
  ListAuditRewardsRequest,
} from "proto/audit";

@Controller("audit")
@AuditServiceControllerMethods()
export class AuditController implements AuditServiceController {
  constructor(@Inject(AUDIT_MODEL) private auditModel: Model<AuditDocument>) {}

  async listAuditRewards(
    request: ListAuditRewardsRequest,
  ): Promise<AuditRewardListResponse> {
    const { page = 1, limit = 10, filterUsername, filterEventId } = request;
    const offset = (page - 1) * limit;
    const filter: { username?: string; eventId?: string } = {};
    if (filterUsername) filter.username = filterUsername;
    if (filterEventId) filter.eventId = filterEventId;
    const rawList = await this.auditModel
      .find(filter)
      .skip(offset)
      .limit(limit);
    const total = await this.auditModel.countDocuments(filter);
    return {
      total,
      page,
      limit,
      filterUsername,
      filterEventId,
      list: rawList.map((a) => ({
        auditId: a._id.toString(),
        userId: a.userId.toString(),
        username: a.username,
        eventId: a.eventId.toString(),
        eventTitle: a.eventTitle,
        claimedRewards:
          a.claimedRewards?.map((r) => ({
            rewardId: r._id.toString(),
            type: r.type,
            title: r.title,
            description: r.description,
            point: r.point || 0,
            coupons: r.coupons || [],
            items: r.items || [],
            active: r.active,
            createdAt: dateToTimestamp(r.createdAt),
            updatedAt: dateToTimestamp(r.updatedAt),
          })) || [],
        timestamp: dateToTimestamp(a.timestamp),
      })),
    };
  }
}
