import { IsBoolean, IsOptional } from "class-validator";
import { BaseListQueryDto } from "./base-list-query.dto";

export class UserListQueryDto extends BaseListQueryDto {
  /**
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  filterActive?: boolean;
}
