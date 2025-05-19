import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { UserListResponse } from "proto/auth";

export class UserConditionDto {
  @IsInt()
  loginStreakDays: number;

  @IsInt()
  referralCount: number;
}

export class UserInventoryDto {
  @IsInt()
  point: number;

  @IsArray()
  @IsString({ each: true })
  coupons: string[];

  @IsArray()
  @IsString({ each: true })
  items: string[];
}

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsString()
  role: string;

  @IsBoolean()
  active: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  lastLoginAt?: Date;

  condition?: UserConditionDto;
  inventory?: UserInventoryDto;
}

export class UserListDto implements Omit<UserListResponse, "list"> {
  @IsInt()
  page: number;

  @IsInt()
  limit: number;

  @IsOptional()
  @IsBoolean()
  filterActive?: boolean;

  @IsInt()
  total: number;

  @IsArray()
  list: Array<UserDto>;
}
