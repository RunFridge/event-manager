import { Controller } from "@nestjs/common";
import {
  Event,
  EventServiceController,
  EventServiceControllerMethods,
  FindOneRequest,
} from "proto/event";

@Controller()
@EventServiceControllerMethods()
export class EventController implements EventServiceController {
  private readonly instanceId = Math.random().toString(36).substring(2, 15);
  findOne(request: FindOneRequest): Event {
    console.log(`[${this.instanceId}] eventId: ${request.eventId}`);
    return { title: `foo#${request.eventId}`, type: "awesome type" };
  }
}
