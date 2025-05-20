import { Inject, Injectable } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import {
  AUDIT_SERVICE_NAME,
  AuditRewardListResponse,
  AuditServiceClient,
  ListAuditRewardsRequest,
} from "proto/audit";
import { EVENT_PACKAGE_NAME } from "proto/event";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AuditService {
  private auditService: AuditServiceClient;
  constructor(@Inject(EVENT_PACKAGE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.auditService =
      this.client.getService<AuditServiceClient>(AUDIT_SERVICE_NAME);
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
