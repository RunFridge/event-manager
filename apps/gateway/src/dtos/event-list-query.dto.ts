import { IsOptional, IsString } from "class-validator";
import { UserListQueryDto } from "./user-list-query.dto";

export class EventListQueryDto extends UserListQueryDto {
  @IsString()
  @IsOptional()
  filterType?: string;
}
