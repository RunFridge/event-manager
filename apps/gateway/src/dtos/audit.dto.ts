import { AuditReward } from "proto/audit";
import { RewardDto } from "./reward.dto";
import { IsArray, IsDate, IsInt, IsOptional, IsString } from "class-validator";

export class AuditDto
  implements Omit<AuditReward, "claimedRewards" | "timestamp">
{
  @IsString()
  auditId: string;

  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  eventId: string;

  @IsString()
  eventTitle: string;

  @IsArray()
  claimedRewards: RewardDto[];

  @IsDate()
  timestamp: Date;
}

export class AuditListDto {
  @IsInt()
  page: number;

  @IsInt()
  limit: number;

  @IsInt()
  total: number;

  @IsOptional()
  @IsString()
  filterUsername?: string;

  @IsOptional()
  @IsString()
  filterEventId?: string;

  @IsArray()
  list: Array<AuditDto>;
}
