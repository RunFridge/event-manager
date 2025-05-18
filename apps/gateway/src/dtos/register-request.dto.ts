import { IsString } from "class-validator";
import { RegisterRequest } from "proto/auth";

export class RegisterRequestDto implements RegisterRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
