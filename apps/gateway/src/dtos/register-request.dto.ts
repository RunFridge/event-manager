import { IsString } from "class-validator";
import { RegisterRequest } from "proto/auth";

export class RegisterRequestDto implements RegisterRequest {
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

  /**
   * @example "test@test.com"
   */
  @IsString()
  referral?: string;
}
