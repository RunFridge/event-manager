import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigurationModule } from "@config/configuration.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE_NAME, protobufPackage as authPackage } from "proto/auth";
import {
  EVENT_SERVICE_NAME,
  protobufPackage as eventPackage,
} from "proto/event";
import {
  AUTH_DEFAULT_PORT,
  DEFAULT_HOST,
  EVENT_DEFAULT_PORT,
} from "@constants/index";

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: authPackage,
          protoPath: "proto/auth.proto",
          url: `${DEFAULT_HOST}:${AUTH_DEFAULT_PORT}`,
        },
      },
      {
        name: EVENT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: eventPackage,
          protoPath: "proto/event.proto",
          url: `${DEFAULT_HOST}:${EVENT_DEFAULT_PORT}`,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
