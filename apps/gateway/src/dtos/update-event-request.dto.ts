import { IsArray, IsOptional, IsString } from "class-validator";
import { UpdateEventRequest } from "proto/event";

export class UpdateEventRequestDto implements UpdateEventRequest {
  @IsString()
  eventId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  rewardIds: string[];
}
