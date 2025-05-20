import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { UpdateRewardRequest } from "proto/reward";

export class UpdateRewardRequestDto
  implements Omit<UpdateRewardRequest, "rewardId">
{
  /**
   * @example "item"
   */
  @IsString()
  type: string;

  /**
   * * @example true
   */
  @IsBoolean()
  active: boolean;

  /**
   * @example "아이템 보상"
   */
  @IsString()
  title: string;

  /**
   * @example "무기 보상"
   */
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * @example []
   */
  @IsArray()
  @IsString({ each: true })
  coupons: string[];

  /**
   * @example ["sword", "bow"]
   */
  @IsArray()
  @IsString({ each: true })
  items: string[];

  /**
   * @example 0
   */
  @IsOptional()
  @IsInt()
  point?: number;
}
