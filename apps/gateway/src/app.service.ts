import { Injectable } from "@nestjs/common";
import { AliveResponseDto } from "./dtos/alive-response.dto";
import { isServerAlive } from "@utils/network";
import {
  AUTH_DEFAULT_PORT,
  DEFAULT_HOST,
  EVENT_DEFAULT_PORT,
} from "@constants/index";
import { ConfigService } from "@nestjs/config";
import { AUTH_PORT, EVENT_PORT } from "@config/env.schema";

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  async alive(): Promise<AliveResponseDto> {
    const authServer = await isServerAlive(
      DEFAULT_HOST,
      this.config.get(AUTH_PORT) || AUTH_DEFAULT_PORT,
    );
    const eventServer = await isServerAlive(
      DEFAULT_HOST,
      this.config.get(EVENT_PORT) || EVENT_DEFAULT_PORT,
    );
    return { authServer, eventServer };
  }
}
