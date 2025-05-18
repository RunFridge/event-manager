import { IsBoolean, IsDate, IsString } from "class-validator";

export class RegisterResponseDto {
  @IsString()
  username: string;

  @IsString()
  role: string;

  @IsBoolean()
  active: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
