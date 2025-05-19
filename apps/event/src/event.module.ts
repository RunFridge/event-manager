import { Module } from "@nestjs/common";
import { ConfigurationModule } from "@config/configuration.module";
import { eventProviders } from "database/providers/event.providers";
import { rewardProviders } from "database/providers/reward.providers";
import { DatabaseModule } from "database/database.module";
import { EventController } from "./event.controller";
import { RewardController } from "./reward.controller";
import { userProviders } from "database/providers/user.providers";
import { AuditController } from "./audit.controller";

@Module({
  imports: [ConfigurationModule, DatabaseModule],
  controllers: [EventController, RewardController, AuditController],
  providers: [...eventProviders, ...rewardProviders, ...userProviders],
})
export class EventModule {}
