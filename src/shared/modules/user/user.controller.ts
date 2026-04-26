import { inject, injectable } from 'inversify';
import {
    BaseController,
    HttpError,
    HttpMethod,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Response } from 'express';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './requests/login-user-request.type.ts';
import { LogoutUserRequest } from './requests/logout-user-request.type.ts';
import { RefreshUserRequest } from './requests/refresh-user-request.type.ts';
import { MeUserRequest } from './requests/me-user-request.type.ts';
import { CreateUserRequest } from './requests/create-user-request.type.js';

@injectable()
export class UserController extends BaseController {
    constructor(
        @inject(Component.Logger) readonly logger: Logger,
        @inject(Component.UserService) private readonly userService: UserService,
        @inject(Component.Config) private readonly config: Config<RestSchema>
    ) {
        super(logger);
        this.logger.info('Register routes for UserController…');

        this.addRoute({
            path: '/register',
            method: HttpMethod.Post,
            handler: this.create,
        });

        this.addRoute({
            path: '/login',
            method: HttpMethod.Post,
            handler: this.login,
        });

        this.addRoute({
            path: '/logout',
            method: HttpMethod.Post,
            handler: this.logout,
        });

        this.addRoute({
            path: '/refresh',
            method: HttpMethod.Post,
            handler: this.refresh,
        });

        this.addRoute({
            path: '/me',
            method: HttpMethod.Get,
            handler: this.me,
        });
    }

    public async create(
        { body }: CreateUserRequest,
        res: Response
    ): Promise<void> {
        const existUser = await this.userService.findByEmail(body.email);

        if (existUser) {
            throw new HttpError(
                StatusCodes.CONFLICT,
                `User with email «${body.email}» exists.`,
                'UserController'
            );
        }

        const result = await this.userService.create(body, this.config.get('SALT'));
        this.created(res, fillDTO(UserRdo, result));
    }

    public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
        const existUser = await this.userService.findByEmail(body.email);
        if (!existUser) {
            throw new HttpError(
                StatusCodes.UNAUTHORIZED,
                `User with email ${body.email} not found.`,
                'UserController'
            );
        }

        this.ok(res, { token: String(existUser._id) });
    }

    public async logout(
        { body }: LogoutUserRequest,
        res: Response
    ): Promise<void> {
        this.noContent(res, { body });
    }

    public async refresh(
        { body }: RefreshUserRequest,
        res: Response
    ): Promise<void> {
        this.ok(res, body.token);
    }

    public async me({ body }: MeUserRequest, res: Response): Promise<void> {
        this.ok(res, { body });
    }
}