import { IsString } from "class-validator";
import { LoginRequest } from "proto/auth";

export class LoginRequestDto implements LoginRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
