import { IsString } from 'class-validator';

export class updateDto {
  @IsString()
  nickname: string;

  @IsString()
  newPassword: string;
}
