import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsString,
} from 'class-validator';
import {
  OfferCityEnum,
  OfferFeatureEnum,
  OfferTypeEmum,
  User,
} from '../../../types/index.js';

export class CreateOfferDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsDateString()
  public date: string;

  @IsEnum(OfferCityEnum)
  public city: string;

  @IsString()
  public preview: string;

  @IsArray()
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsBoolean()
  public isFavorite: boolean;

  @IsInt()
  public rating: number;

  @IsEnum(OfferTypeEmum)
  public type: string;

  @IsInt()
  public rooms: number;

  @IsInt()
  public guests: number;

  @IsInt()
  public price: number;

  @IsEnum(OfferFeatureEnum)
  public features: string[];

  @IsMongoId()
  public user: User;

  @IsArray()
  public coordinates: number[];
}
