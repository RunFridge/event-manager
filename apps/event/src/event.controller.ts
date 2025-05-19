import {
  AUDIT_MODEL,
  EVENT_MODEL,
  REWARD_MODEL,
  USER_MODEL,
} from "@constants/mongo";
import { Controller, Inject } from "@nestjs/common";
import { dateToTimestamp } from "@utils/date";
import { AuditDocument } from "database/schemas/audit.schema";
import { EventDocument } from "database/schemas/event.schema";
import { RewardDocument } from "database/schemas/reward.schema";
import { UserDocument } from "database/schemas/user.schema";
import { Model, Types } from "mongoose";
import {
  ClaimEventRewardRequest,
  CommonResponse,
  CreateEventRequest,
  DeleteEventRequest,
  EventServiceController,
  EventServiceControllerMethods,
  GetEventRequest,
  ListEventsRequest,
  ListEventsResponse,
  UpdateEventRequest,
} from "proto/event";

@Controller("event")
@EventServiceControllerMethods()
export class EventController implements EventServiceController {
  constructor(
    @Inject(EVENT_MODEL) private eventModel: Model<EventDocument>,
    @Inject(REWARD_MODEL) private rewardModel: Model<RewardDocument>,
    @Inject(USER_MODEL) private userModel: Model<UserDocument>,
    @Inject(AUDIT_MODEL) private auditModel: Model<AuditDocument>,
  ) {}

  async listEvents(request: ListEventsRequest): Promise<ListEventsResponse> {
    const { page = 1, limit = 10, filterActive, filterType } = request;
    const offset = (page - 1) * limit;
    const filter: { active?: boolean; type?: string } = {};
    if (filterActive) filter.active = filterActive;
    if (filterType) filter.type = filterType;
    const rawList = await this.eventModel
      .find(filter)
      .select({ rewards: 0 })
      .skip(offset)
      .limit(limit);
    const total = await this.eventModel.countDocuments(filter);
    return {
      total,
      page,
      limit,
      filterActive,
      filterType,
      list: rawList.map((e) => ({
        eventId: e._id.toString(),
        type: e.type,
        title: e.title,
        description: e.description,
        active: e.active,
        targetCriteria: e.targetCriteria,
        rewards: [],
        createdAt: dateToTimestamp(e.createdAt),
        updatedAt: dateToTimestamp(e.updatedAt),
      })),
    };
  }

  async getEvent(request: GetEventRequest): Promise<CommonResponse> {
    const { eventId } = request;
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      return {
        result: false,
        message: "event not found",
      };
    }
    return {
      result: true,
      eventResponse: {
        eventId: event._id.toString(),
        type: event.type,
        title: event.title,
        description: event.description,
        targetCriteria: event.targetCriteria,
        active: event.active,
        rewards: event.rewards.map((r) => ({
          rewardId: r._id.toString(),
          type: r.type,
          title: r.title,
          description: r.description,
          point: r.point,
          coupons: r.coupons || [],
          items: r.items || [],
          active: r.active,
        })),
        createdAt: dateToTimestamp(event.createdAt),
        updatedAt: dateToTimestamp(event.updatedAt),
      },
    };
  }

  async createEvent(request: CreateEventRequest): Promise<CommonResponse> {
    const rewards = await this.rewardModel.find({
      _id: { $in: request.rewardIds.map((id) => new Types.ObjectId(id)) },
    });
    if (rewards.length !== request.rewardIds.length) {
      return { result: false, message: "invalid reward id" };
    }
    if (rewards.some((r) => !r.active)) {
      return { result: false, message: "inactive reward id" };
    }
    const createdEvent = await this.eventModel.create({
      title: request.title,
      description: request.description,
      targetCriteria: request.targetCriteria,
      rewards: rewards.map((r) => ({
        _id: r._id,
        type: r.type,
        title: r.title,
        description: r.description,
        points: r.point,
      })),
    });
    return {
      result: true,
      eventResponse: {
        eventId: createdEvent._id.toString(),
        type: createdEvent.type,
        title: createdEvent.title,
        description: createdEvent.description,
        active: createdEvent.active,
        targetCriteria: createdEvent.targetCriteria,
        rewards: createdEvent.rewards.map((r) => ({
          rewardId: r._id.toString(),
          type: r.type,
          title: r.title,
          description: r.description,
          point: r.point,
          coupons: r.coupons || [],
          items: r.items || [],
          active: r.active,
        })),
        createdAt: dateToTimestamp(createdEvent.createdAt),
        updatedAt: dateToTimestamp(createdEvent.updatedAt),
      },
    };
  }

  async updateEvent(request: UpdateEventRequest): Promise<CommonResponse> {
    const { eventId, rewardIds, ...updateData } = request;
    const rewards = await this.rewardModel.find({
      _id: { $in: rewardIds.map((id) => new Types.ObjectId(id)) },
    });
    if (rewards.length !== rewardIds.length) {
      return { result: false, message: "invalid reward id" };
    }
    if (rewards.some((r) => !r.active)) {
      return { result: false, message: "inactive reward id" };
    }
    const updatedEvent = await this.eventModel.findOneAndUpdate(
      { _id: eventId },
      {
        ...updateData,
        rewards: rewards.map((r) => ({
          _id: r._id,
          type: r.type,
          title: r.title,
          description: r.description,
          points: r.point,
        })),
      },
      { new: true },
    );
    if (!updatedEvent) return { result: false, message: "Event not found" };
    return {
      result: true,
      eventResponse: {
        eventId: updatedEvent._id.toString(),
        type: updatedEvent.type,
        title: updatedEvent.title,
        description: updatedEvent.description,
        active: updatedEvent.active,
        targetCriteria: updatedEvent.targetCriteria,
        rewards: updatedEvent.rewards.map((r) => ({
          rewardId: r._id.toString(),
          type: r.type,
          title: r.title,
          description: r.description,
          point: r.point,
          coupons: r.coupons || [],
          items: r.items || [],
          active: r.active,
        })),
        createdAt: dateToTimestamp(updatedEvent.createdAt),
        updatedAt: dateToTimestamp(updatedEvent.updatedAt),
      },
    };
  }

  async deleteEvent(request: DeleteEventRequest): Promise<CommonResponse> {
    const deletedEvent = await this.eventModel.findOneAndDelete(
      { _id: request.eventId },
      { new: true },
    );
    if (!deletedEvent) return { result: false, message: "Event not found" };
    return { result: true, message: "Event deleted" };
  }

  private isBirthday(birthday?: Date): boolean {
    if (!birthday) return false;
    const birthdayMonth = birthday.getMonth();
    const birthdayDay = birthday.getDate();

    const now = new Date();

    const targetMonth = now.getMonth();
    const targetDay = now.getDate();

    return birthdayMonth === targetMonth && birthdayDay === targetDay;
  }

  private async giveReward(
    rewards: RewardDocument[],
    userId: Types.ObjectId,
    eventId: Types.ObjectId,
  ): Promise<boolean> {
    let rewardItems: string[] = [];
    let rewardCoupons: string[] = [];
    let rewardPoints: number = 0;
    for (const reward of rewards) {
      switch (reward.type) {
        case "item":
          rewardItems = reward.items || [];
          break;
        case "coupon":
          rewardCoupons = reward.coupons || [];
          break;
        case "point":
          rewardPoints += reward.point || 0;
      }
    }
    const rewardedUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          "$inventory.items": {
            $each: rewardItems,
          },
          "$inventory.coupons": {
            $each: rewardCoupons,
          },
          claimedEventIds: eventId,
        },
        $inc: { "$inventory.point": rewardPoints },
      },
    );
    if (!rewardedUser) return false;
    return true;
  }

  async claimEventReward(
    request: ClaimEventRewardRequest,
  ): Promise<CommonResponse> {
    const { eventId, username } = request;
    const user = await this.userModel
      .findOne({ username })
      .select({ password: 0 });
    if (!user) return { result: false, message: "user does not exists" };
    const event = await this.eventModel.findById(eventId);
    if (!event) return { result: false, message: "event does not exists" };
    if (!event.active) return { result: false, message: "event not active" };
    if (user.claimedEventIds.map((e) => e.toString()).includes(eventId)) {
      return { result: false, message: "already claimed" };
    }

    let giveReward = false;
    switch (event.type) {
      case "birthday":
        if (this.isBirthday(user.birthday)) giveReward = true;
        break;
      case "login":
        if (user.condition.loginStreakDays >= event.targetCriteria)
          giveReward = true;
        break;
      case "invite":
        if (user.condition.referralCount >= event.targetCriteria)
          giveReward = true;
        break;
    }
    if (giveReward) {
      await this.giveReward(event.rewards, user._id, event._id);
      await this.auditModel.create({
        userId: user._id,
        username: user.username,
        eventId: event._id,
        eventTitle: event.title,
        claimedRewards: event.rewards,
      });
    }

    return {
      result: giveReward,
      message: giveReward ? "claimed reward" : "criteria not fulfilled",
    };
  }
}
