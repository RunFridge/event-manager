import { IsOptional, IsString } from "class-validator";
import { UserListQueryDto } from "./user-list-query.dto";

export class EventListQueryDto extends UserListQueryDto {
  /**
   * @example "login"
   */
  @IsString()
  @IsOptional()
  filterType?: string;
}
