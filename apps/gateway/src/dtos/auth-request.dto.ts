import { IsString } from "class-validator";
import { AuthRequest } from "proto/auth";

export class AuthRequestDto implements AuthRequest {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
