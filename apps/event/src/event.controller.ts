import { EVENT_MODEL, REWARD_MODEL } from "@constants/mongo";
import { Controller, Inject } from "@nestjs/common";
import { dateToTimestamp } from "@utils/date";
import { EventDocument } from "database/schemas/event.schema";
import { RewardDocument } from "database/schemas/reward.schema";
import { Model, Types } from "mongoose";
import {
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
        title: event.title,
        description: event.description,
        rewards: event.rewards.map((r) => ({
          rewardId: r._id.toString(),
          type: r.type,
          title: r.title,
          description: r.description,
          points: r.points,
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
      rewards: rewards.map((r) => ({
        _id: r._id,
        type: r.type,
        title: r.title,
        description: r.description,
        points: r.points,
      })),
    });
    return {
      result: true,
      eventResponse: {
        eventId: createdEvent._id.toString(),
        title: createdEvent.title,
        description: createdEvent.description,
        rewards: createdEvent.rewards.map((r) => ({
          rewardId: r._id.toString(),
          type: r.type,
          title: r.title,
          description: r.description,
          points: r.points,
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
          points: r.points,
        })),
      },
      { new: true },
    );
    if (!updatedEvent) return { result: false, message: "Event not found" };
    return {
      result: true,
      eventResponse: {
        eventId: updatedEvent._id.toString(),
        title: updatedEvent.title,
        description: updatedEvent.description,
        rewards: updatedEvent.rewards.map((r) => ({
          rewardId: r._id.toString(),
          type: r.type,
          title: r.title,
          description: r.description,
          points: r.points,
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
}
