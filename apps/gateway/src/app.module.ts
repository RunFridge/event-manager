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
import { DEFAULT_HOST } from "@constants/index";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./auth/jwt.strategy";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { EventModule } from "./event/event.module";
import { RewardModule } from "./reward/reward.module";
import { ClientModule } from "./client/client.module";
import { AuditModule } from "./audit/audit.module";

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: AUTH_SERVICE_NAME,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const authPort = config.get<number>("AUTH_PORT");
            return {
              transport: Transport.GRPC,
              options: {
                package: authPackage,
                protoPath: "proto/auth.proto",
                url: `${DEFAULT_HOST}:${authPort}`,
              },
            };
          },
        },
        {
          name: EVENT_SERVICE_NAME,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const eventPort = config.get<number>("EVENT_PORT");
            return {
              transport: Transport.GRPC,
              options: {
                package: eventPackage,
                protoPath: "proto/event.proto",
                url: `${DEFAULT_HOST}:${eventPort}`,
              },
            };
          },
        },
      ],
    }),
    AuthModule,
    UserModule,
    EventModule,
    RewardModule,
    ClientModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
