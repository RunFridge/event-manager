import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigurationModule } from "@config/configuration.module";

@Module({
  imports: [ConfigurationModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
