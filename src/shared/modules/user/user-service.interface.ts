import { DocumentType, Ref } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { OfferEntity } from '../offer/index.ts';
import { UpdateUserDto } from './dto/update-user.dto.ts';

export interface UserService {
    create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
    findById(id: string): Promise<DocumentType<UserEntity> | null>;
    findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
    findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
    addFavorite(userId: string, offerId: string): Promise<void>;
    getFavorites(userId: string): Promise<Ref<OfferEntity>[]>;
    deleteFavorite(userId: string, offerId: string): Promise<void>;
    getFavoriteIds(userId: string): Promise<string[]>;
    updateById(
        id: string,
        dto: UpdateUserDto
    ): Promise<DocumentType<UserEntity> | null>;
}
