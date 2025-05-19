import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { ConfigurationModule } from "@config/configuration.module";
import { eventProviders } from "database/providers/event.providers";

@Module({
  imports: [ConfigurationModule],
  controllers: [EventController],
  providers: [...eventProviders],
})
export class EventModule {}
