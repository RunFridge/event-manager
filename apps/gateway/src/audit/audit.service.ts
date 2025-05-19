import { Inject, Injectable } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import {
  AuditRewardListResponse,
  AuditServiceClient,
  ListAuditRewardsRequest,
} from "proto/audit";
import { EVENT_SERVICE_NAME } from "proto/event";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AuditService {
  private auditService: AuditServiceClient;
  constructor(@Inject(EVENT_SERVICE_NAME) private eventClient: ClientGrpc) {}
  onModuleInit() {
    this.auditService =
      this.eventClient.getService<AuditServiceClient>(EVENT_SERVICE_NAME);
  }

  listAuditReward(
    request: ListAuditRewardsRequest,
  ): Observable<AuditRewardListResponse> {
    return this.auditService.listAuditRewards(request).pipe(
      catchError((error: unknown) => {
        console.error("list audit error: ", error);
        return throwError(() => error);
      }),
    );
  }
}
