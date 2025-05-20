import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { UpdateEventRequest } from "proto/event";

export class UpdateEventRequestDto
  implements Omit<UpdateEventRequest, "eventId">
{
  /**
   * @example "birthday"
   */
  @IsString()
  type: string;

  /**
   * @example true
   */
  @IsBoolean()
  active: boolean;

  /**
   * @example "생일 이벤트"
   */
  @IsString()
  title: string;

  /**
   * @example 0
   */
  @IsInt()
  targetCriteria: number;

  /**
   * @example "생일 이벤트입니다."
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * @example [507f1f77bcf86cd799439011]
   */
  @IsArray()
  @IsString({ each: true })
  rewardIds: string[];
}
