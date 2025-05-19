import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { ConfigurationModule } from "@config/configuration.module";
import { eventProviders } from "database/providers/event.providers";
import { rewardProviders } from "database/providers/reward.providers";
import { DatabaseModule } from "database/database.module";

@Module({
  imports: [ConfigurationModule, DatabaseModule],
  controllers: [EventController],
  providers: [...eventProviders, ...rewardProviders],
})
export class EventModule {}
