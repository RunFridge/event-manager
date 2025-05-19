import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, AuthServiceClient } from "proto/auth";
import { EVENT_SERVICE_NAME, EventServiceClient } from "proto/event";
import { RewardServiceClient } from "proto/reward";

@Injectable()
export class ClientService implements OnModuleInit {
  private rewardService: RewardServiceClient;
  private authService: AuthServiceClient;
  private eventService: EventServiceClient;
  constructor(
    @Inject(EVENT_SERVICE_NAME) private eventClient: ClientGrpc,
    @Inject(AUTH_SERVICE_NAME) private authClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.eventService =
      this.eventClient.getService<EventServiceClient>(EVENT_SERVICE_NAME);
    this.rewardService =
      this.eventClient.getService<RewardServiceClient>(EVENT_SERVICE_NAME);
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
}
