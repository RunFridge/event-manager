import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { catchError, Observable, throwError } from "rxjs";
import {
  AUTH_SERVICE_NAME,
  AuthRequest,
  AuthServiceClient,
  CommonResponse,
} from "proto/auth";
import {
  Event,
  EVENT_SERVICE_NAME,
  EventServiceClient,
  FindOneRequest,
} from "proto/event";
import { AliveResponseDto } from "./dtos/AliveResponse.dto";
import { isServerAlive } from "@utils/network";
import {
  AUTH_DEFAULT_PORT,
  DEFAULT_HOST,
  EVENT_DEFAULT_PORT,
} from "@constants/index";
import { ConfigService } from "@nestjs/config";
import { AUTH_PORT, EVENT_PORT } from "@config/env.schema";

@Injectable()
export class AppService implements OnModuleInit {
  private authService: AuthServiceClient;
  private eventService: EventServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc,
    @Inject(EVENT_SERVICE_NAME) private eventClient: ClientGrpc,
    private config: ConfigService,
  ) {}

  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    this.eventService =
      this.eventClient.getService<EventServiceClient>(EVENT_SERVICE_NAME);
  }

  async alive(): Promise<AliveResponseDto> {
    const authServer = await isServerAlive(
      DEFAULT_HOST,
      this.config.get(AUTH_PORT) || AUTH_DEFAULT_PORT,
    );
    const eventServer = await isServerAlive(
      DEFAULT_HOST,
      this.config.get(EVENT_PORT) || EVENT_DEFAULT_PORT,
    );
    return { authServer, eventServer };
  }

  register(request: AuthRequest): Observable<CommonResponse> {
    return this.authService.register(request).pipe(
      catchError((error: unknown) => {
        console.error("Register error: ", error);
        return throwError(() => error);
      }),
    );
  }

  login(request: AuthRequest): Observable<CommonResponse> {
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
