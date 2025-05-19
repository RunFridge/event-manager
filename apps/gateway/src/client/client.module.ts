import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { EventService } from "../event/event.service";
import { JwtService } from "@nestjs/jwt";
import { AuditService } from "../audit/audit.service";

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [AuditService, EventService, JwtService],
})
export class ClientModule {}
