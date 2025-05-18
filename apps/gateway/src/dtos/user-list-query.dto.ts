import { IsBoolean, IsInt, IsOptional } from "class-validator";

export class UserListQueryDto {
  @IsInt()
  @IsOptional()
  page?: number;

  @IsInt()
  @IsOptional()
  limit?: number;

  @IsBoolean()
  @IsOptional()
  filterActive?: boolean;
}
