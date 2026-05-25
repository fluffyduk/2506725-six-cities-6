import { IsEmail, IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { UserType, UserTypeEnum } from '../../../types/index.ts';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  public name?: string;

  @IsOptional()
  @IsString()
  @Length(6, 12)
  public password?: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  public type?: UserType;

  @IsOptional()
  @IsString()
  public avatar?: string;
}
