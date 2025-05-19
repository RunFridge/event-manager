import { IsOptional, IsString } from "class-validator";
import { BaseListQueryDto } from "./base-list-query.dto";

export class AuditListQueryDto extends BaseListQueryDto {
  @IsString()
  @IsOptional()
  filterUsername?: string;

  @IsString()
  @IsOptional()
  filterEventId?: string;
}
