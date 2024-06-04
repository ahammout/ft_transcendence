import { IsString, MaxLength } from 'class-validator';

export class EditProfileDto {
  @IsString()
  @MaxLength(15)
  firstName?: string;

  @IsString()
  @MaxLength(15)
  lastName?: string;

  @IsString()
  @MaxLength(15)
  nickname?: string;

  @IsString()
  newPassword?: string;
}
