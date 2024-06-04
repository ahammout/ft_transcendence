import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string;
}
