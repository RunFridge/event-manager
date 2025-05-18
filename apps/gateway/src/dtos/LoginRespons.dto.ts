import { IsNumber, IsString } from "class-validator";

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsNumber()
  accessTokenExpiresIn: number;

  @IsNumber()
  refreshTokenExpiresIn: number;
}
