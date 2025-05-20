import { IsString } from "class-validator";
import { LoginRequest } from "proto/auth";

export class LoginRequestDto implements LoginRequest {
  /**
   * @example "test@test.com"
   */
  @IsString()
  username: string;

  /**
   * @example "test1234"
   */
  @IsString()
  password: string;
}
