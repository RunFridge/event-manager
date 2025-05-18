import { IsBoolean } from "class-validator";

export class AliveResponseDto {
  @IsBoolean()
  authServer: boolean;

  @IsBoolean()
  eventServer: boolean;
}
