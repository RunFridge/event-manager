import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { UserListResponse } from "proto/auth";

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
