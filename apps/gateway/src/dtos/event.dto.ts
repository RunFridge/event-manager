import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";
import { RewardDto } from "./reward.dto";
import { ListEventsResponse } from "proto/event";

export class EventDto {
  @IsString()
  eventId: string;

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
  rewards: Omit<RewardDto, "createdAt" | "updatedAt">[];

  @IsBoolean()
  active: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class EventListDto implements Omit<ListEventsResponse, "list"> {
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
  list: Array<EventDto>;
}
