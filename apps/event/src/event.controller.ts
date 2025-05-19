import { EVENT_MODEL } from "@constants/mongo";
import { Controller, Inject } from "@nestjs/common";
import { dateToTimestamp } from "@utils/date";
import { EventDocument } from "database/schemas/event.schema";
import { Model } from "mongoose";
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
  constructor(@Inject(EVENT_MODEL) private eventModel: Model<EventDocument>) {}

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
    return;
  }

  async createEvent(request: CreateEventRequest): Promise<CommonResponse> {
    return;
  }

  async updateEvent(request: UpdateEventRequest): Promise<CommonResponse> {
    return;
  }

  async deleteEvent(request: DeleteEventRequest): Promise<CommonResponse> {
    return;
  }
}
