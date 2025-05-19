import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuditService } from "./audit.service";

@ApiTags("감사 관리")
@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get("reward")
  async listRewardAudit() {}
}
