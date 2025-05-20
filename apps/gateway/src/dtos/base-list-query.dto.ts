import { IsInt, IsOptional } from "class-validator";

export class BaseListQueryDto {
  /**
   * @example 1
   */
  @IsInt()
  @IsOptional()
  page?: number = 1;

  /**
   * @example 10
   */
  @IsInt()
  @IsOptional()
  limit?: number = 10;
}
