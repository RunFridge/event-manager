import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { catchError, Observable, throwError } from "rxjs";
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  LoginRequest,
  TokenResponse,
} from "proto/auth";
import {
  Event,
  EVENT_SERVICE_NAME,
  EventServiceClient,
  FindOneRequest,
} from "proto/event";

@Injectable()
export class AppService implements OnModuleInit {
  private authService: AuthServiceClient;
  private eventService: EventServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc,
    @Inject(EVENT_SERVICE_NAME) private eventClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    this.eventService =
      this.eventClient.getService<EventServiceClient>(EVENT_SERVICE_NAME);
  }

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.authService.login(request).pipe(
      catchError((error: unknown) => {
        console.error("Login error: ", error);
        return throwError(() => error);
      }),
    );
  }

  findOneEvent(request: FindOneRequest): Observable<Event> {
    return this.eventService.findOne(request).pipe(
      catchError((error: unknown) => {
        console.error("Find one event error: ", error);
        return throwError(() => error);
      }),
    );
  }
}
