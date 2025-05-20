import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { CreateEventRequest } from "proto/event";

export class CreateEventRequestDto implements CreateEventRequest {
  /**
   * @example "login"
   */
  @IsString()
  type: string;

  /**
   * @example "연속 로그인 이벤트"
   */
  @IsString()
  title: string;

  /**
   * @example "10일 연속 로그인 시 1000 포인트 지급"
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * @example 10
   */
  @IsInt()
  targetCriteria: number;

  /**
   * @example [507f1f77bcf86cd799439011]
   */
  @IsArray()
  @IsString({ each: true })
  rewardIds: string[];
}
