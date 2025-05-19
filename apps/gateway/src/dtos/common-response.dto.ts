import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CommonResponseDto {
  @IsBoolean()
  result: boolean;

  @IsString()
  @IsOptional()
  message?: string;
}
