import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { CreateRewardRequest } from "proto/reward";

export class CreateRewardRequestDto implements CreateRewardRequest {
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
}
