import { LoginUserDto, UserEntity } from '../user/index.ts';

export interface AuthService {
    authenticate(user: UserEntity): Promise<string>;
    verify(dto: LoginUserDto): Promise<UserEntity>;
}
