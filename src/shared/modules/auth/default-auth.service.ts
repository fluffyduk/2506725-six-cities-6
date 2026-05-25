import { inject, injectable } from 'inversify';
import { AuthService } from './auth-service.interface.ts';
import { Component } from '../../types/index.ts';
import { Logger } from '../../libs/logger/logger.interface.ts';
import { UserService } from '../user/user-service.interface.ts';
import { Config } from '../../libs/config/config.interface.ts';
import { RestSchema } from '../../libs/config/rest.schema.ts';
import { LoginUserDto, UserEntity } from '../user/index.ts';
import { createSecretKey } from 'node:crypto';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.ts';
import { UserNotFoundException, UserWrongPasswordException } from '../../libs/rest/errors/index.ts';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.UserService) private readonly userService: UserService,
        @inject(Component.Config) private readonly config: Config<RestSchema>
  ) { }

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secterKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secterKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserWrongPasswordException();
    }

    return user;
  }
}
