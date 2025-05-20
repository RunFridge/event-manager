import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigurationModule } from "@config/configuration.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_PACKAGE_NAME } from "proto/auth";
import { EVENT_PACKAGE_NAME } from "proto/event";
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
import { REWARD_PACKAGE_NAME } from "proto/reward";
import { AUDIT_PACKAGE_NAME } from "proto/audit";

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: AUTH_PACKAGE_NAME,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const isProduction = process.env.NODE_ENV === "production";
            const authPort = config.get<number>("AUTH_PORT");
            const host = isProduction ? "auth" : DEFAULT_HOST;
            return {
              transport: Transport.GRPC,
              options: {
                package: AUTH_PACKAGE_NAME,
                protoPath: "proto/auth.proto",
                url: `${host}:${authPort}`,
              },
            };
          },
        },
        {
          name: EVENT_PACKAGE_NAME,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const isProduction = process.env.NODE_ENV === "production";
            const eventPort = config.get<number>("EVENT_PORT");
            const host = isProduction ? "event" : DEFAULT_HOST;
            return {
              transport: Transport.GRPC,
              options: {
                package: [
                  EVENT_PACKAGE_NAME,
                  REWARD_PACKAGE_NAME,
                  AUDIT_PACKAGE_NAME,
                ],
                protoPath: [
                  "proto/event.proto",
                  "proto/reward.proto",
                  "proto/audit.proto",
                ],
                url: `${host}:${eventPort}`,
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
    AuditModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
