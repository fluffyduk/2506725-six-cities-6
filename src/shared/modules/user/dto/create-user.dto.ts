import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { CreateUserValidationMessages } from './create-user.messages.ts';
import { UserType, UserTypeEnum } from '../../../types/index.ts';

export class CreateUserDto {
    @IsEmail({}, { message: CreateUserValidationMessages.email.invalidFormat })
  public email: string;

    @IsString({ message: CreateUserValidationMessages.name.required })
    @Length(1, 15, { message: CreateUserValidationMessages.name.lengthField })
    public name: string;

    @IsString({ message: CreateUserValidationMessages.password.required })
    @Length(6, 12, { message: CreateUserValidationMessages.password.lengthField })
    public password: string;

    @IsEnum(UserTypeEnum, { message: CreateUserValidationMessages.type.invalidType })
    public type: UserType;
}
