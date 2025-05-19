import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { CreateEventRequest } from "proto/event";

export class CreateEventRequestDto implements CreateEventRequest {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  targetCriteria: number;

  @IsArray()
  @IsString({ each: true })
  rewardIds: string[];
}
