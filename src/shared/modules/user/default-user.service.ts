import { DocumentType, Ref, types } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.ts';
import { UserService } from './user-service.interface.ts';
import { UserEntity } from './user.entity.ts';
import { inject, injectable } from 'inversify';
import { Component, User } from '../../types/index.ts';
import { Logger } from '../../libs/logger/index.ts';
import { OfferEntity } from '../offer/index.ts';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) { }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto as User);
    user.setPassword(dto.password, salt);

    const result = this.userModel.create(user);
    this.logger.info(`Создан новый пользователь: ${user.email}`);

    return result as Promise<DocumentType<UserEntity>>;
  }

  public findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: id });
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async addFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: offerId },
    });
  }

  public async getFavorites(userId: string): Promise<Ref<OfferEntity>[]> {
    const existedUser = await this.findById(userId);
    if (existedUser) {
      await existedUser.populate('favorites');
    }
    return existedUser?.favorites || [];
  }

  public async getFavoriteIds(userId: string): Promise<string[]> {
    const user = await this.findById(userId);
    if (!user || !user.favorites) {
      return [];
    }
    this.logger.info(user.favorites.toString());
    return [...user.favorites].map((favorite) => favorite.toString());
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { favorites: offerId },
    });
  }
}
