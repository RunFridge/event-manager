import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { ConfigurationModule } from "@config/configuration.module";

@Module({
  imports: [ConfigurationModule],
  controllers: [EventController],
  providers: [],
})
export class EventModule {}
