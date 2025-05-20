import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { EVENT_PACKAGE_NAME } from "proto/event";
import {
  CommonResponse,
  CreateRewardRequest,
  DeleteRewardRequest,
  ListRewardRequest,
  ListRewardResponse,
  REWARD_SERVICE_NAME,
  RewardServiceClient,
  UpdateRewardRequest,
} from "proto/reward";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class RewardService implements OnModuleInit {
  private rewardService: RewardServiceClient;
  constructor(@Inject(EVENT_PACKAGE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.rewardService =
      this.client.getService<RewardServiceClient>(REWARD_SERVICE_NAME);
  }

  createReward(request: CreateRewardRequest): Observable<CommonResponse> {
    return this.rewardService.createReward(request).pipe(
      catchError((error: unknown) => {
        console.error("create reward error: ", error);
        return throwError(() => error);
      }),
    );
  }

  listReward(request: ListRewardRequest): Observable<ListRewardResponse> {
    return this.rewardService.listReward(request).pipe(
      catchError((error: unknown) => {
        console.error("list reward error: ", error);
        return throwError(() => error);
      }),
    );
  }

  updateReward(request: UpdateRewardRequest): Observable<CommonResponse> {
    return this.rewardService.updateReward(request).pipe(
      catchError((error: unknown) => {
        console.error("update reward error: ", error);
        return throwError(() => error);
      }),
    );
  }

  deleteReward(request: DeleteRewardRequest): Observable<CommonResponse> {
    return this.rewardService.deleteReward(request).pipe(
      catchError((error: unknown) => {
        console.error("delete reward error: ", error);
        return throwError(() => error);
      }),
    );
  }
}
