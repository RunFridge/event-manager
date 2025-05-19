import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { Reward } from "proto/event";
import { ListRewardRequest } from "proto/reward";

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

export class RewardListDto implements Omit<ListRewardRequest, "list"> {
  @IsInt()
  page: number;

  @IsInt()
  limit: number;

  @IsOptional()
  @IsBoolean()
  filterActive?: boolean;

  @IsOptional()
  @IsString()
  filterType?: string;

  @IsInt()
  total: number;

  @IsArray()
  list: Array<RewardDto>;
}
