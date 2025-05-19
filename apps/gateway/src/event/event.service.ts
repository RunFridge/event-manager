import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import {
  ClaimEventRewardRequest,
  CommonResponse,
  CreateEventRequest,
  DeleteEventRequest,
  EVENT_SERVICE_NAME,
  EventServiceClient,
  GetEventRequest,
  ListEventsRequest,
  ListEventsResponse,
  UpdateEventRequest,
} from "proto/event";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class EventService implements OnModuleInit {
  private eventService: EventServiceClient;
  constructor(@Inject(EVENT_SERVICE_NAME) private eventClient: ClientGrpc) {}
  onModuleInit() {
    this.eventService =
      this.eventClient.getService<EventServiceClient>(EVENT_SERVICE_NAME);
  }

  createEvent(request: CreateEventRequest): Observable<CommonResponse> {
    return this.eventService.createEvent(request).pipe(
      catchError((error: unknown) => {
        console.error("create event error: ", error);
        return throwError(() => error);
      }),
    );
  }

  listEvents(request: ListEventsRequest): Observable<ListEventsResponse> {
    return this.eventService.listEvents(request).pipe(
      catchError((error: unknown) => {
        console.error("list event error: ", error);
        return throwError(() => error);
      }),
    );
  }

  updateEvent(request: UpdateEventRequest): Observable<CommonResponse> {
    return this.eventService.updateEvent(request).pipe(
      catchError((error: unknown) => {
        console.error("get event error: ", error);
        return throwError(() => error);
      }),
    );
  }

  getEvent(request: GetEventRequest): Observable<CommonResponse> {
    return this.eventService.getEvent(request).pipe(
      catchError((error: unknown) => {
        console.error("get event error: ", error);
        return throwError(() => error);
      }),
    );
  }

  deleteEvent(request: DeleteEventRequest): Observable<CommonResponse> {
    return this.eventService.deleteEvent(request).pipe(
      catchError((error: unknown) => {
        console.error("delete event error: ", error);
        return throwError(() => error);
      }),
    );
  }

  claimEventReward(
    request: ClaimEventRewardRequest,
  ): Observable<CommonResponse> {
    return this.eventService.claimEventReward(request).pipe(
      catchError((error: unknown) => {
        console.error("claim event error: ", error);
        return throwError(() => error);
      }),
    );
  }
}
