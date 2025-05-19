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
  @IsString()
  type: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  coupons: string[];

  @IsArray()
  @IsString({ each: true })
  items: string[];

  @IsOptional()
  @IsInt()
  point?: number;
}
