import { IsOptional, IsString } from "class-validator";
import { BaseListQueryDto } from "./base-list-query.dto";

export class AuditListQueryDto extends BaseListQueryDto {
  /**
   * @example test@test.com
   */
  @IsString()
  @IsOptional()
  filterUsername?: string;

  /**
   * @example 507f1f77bcf86cd799439011
   */
  @IsString()
  @IsOptional()
  filterEventId?: string;
}
