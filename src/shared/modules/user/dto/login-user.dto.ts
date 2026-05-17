import { IsEmail, IsString } from "class-validator";
import { LoginUserValidationMessage } from "./login-user.messages.ts";

export class LoginUserDto {
    @IsEmail({}, { message: LoginUserValidationMessage.email.invalidFormat })
    public email: string;

    @IsString({ message: LoginUserValidationMessage.password.required })
    public password: string;
}
