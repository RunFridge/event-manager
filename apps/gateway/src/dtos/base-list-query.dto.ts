import { IsInt, IsOptional } from "class-validator";

export class BaseListQueryDto {
  @IsInt()
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @IsOptional()
  limit?: number = 10;
}
