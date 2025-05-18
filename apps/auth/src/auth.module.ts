import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigurationModule } from "@config/configuration.module";
import { DatabaseModule } from "database/database.module";
import { userProviders } from "database/providers/user.providers";

@Module({
  imports: [ConfigurationModule, DatabaseModule],
  controllers: [AuthController],
  providers: [...userProviders],
})
export class AuthModule {}
