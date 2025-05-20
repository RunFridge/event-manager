import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { CreateRewardRequest } from "proto/reward";

export class CreateRewardRequestDto implements CreateRewardRequest {
  /**
   * @example "point"
   */
  @IsString()
  type: string;

  /**
   * @example "포인트 보상"
   */
  @IsString()
  title: string;

  /**
   * @example "1000 포인트 지급"
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
   * @example []
   */
  @IsArray()
  @IsString({ each: true })
  items: string[];

  /**
   * @example 1000
   */
  @IsInt()
  @IsOptional()
  point?: number;
}
