import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { Reward } from "proto/event";

export class RewardDto implements Reward {
  @IsString()
  rewardId: string;

  @IsString()
  type: string;

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

  @IsInt()
  @IsOptional()
  point?: number;

  @IsBoolean()
  active: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
