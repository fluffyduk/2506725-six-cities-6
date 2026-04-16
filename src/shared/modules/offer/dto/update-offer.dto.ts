import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from "class-validator";
import { OfferCityEnum, OfferFeatureEnum, OfferTypeEmum } from "../../../types/index.ts";

export class UpdateOfferDto {
    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public description?: string;

    @IsOptional()
    @IsDateString()
    public date?: string;

    @IsOptional()
    @IsEnum(OfferCityEnum)
    public city?: string;

    @IsOptional()
    @IsString()
    public preview?: string;

    @IsOptional()
    @IsArray()
    public images?: string[];

    @IsOptional()
    @IsBoolean()
    public isPremium?: boolean;

    @IsOptional()
    @IsBoolean()
    public isFavorite?: boolean;

    @IsOptional()
    @IsInt()
    public rating?: number;

    @IsOptional()
    @IsEnum(OfferTypeEmum)
    public type?: string;

    @IsOptional()
    @IsInt()
    public rooms?: number;

    @IsOptional()
    @IsInt()
    public guests?: number;

    @IsOptional()
    @IsInt()
    public price?: number;

    @IsOptional()
    @IsEnum(OfferFeatureEnum)
    public features?: string[];

    @IsOptional()
    @IsMongoId()
    public authorId?: string;

    @IsOptional()
    @IsArray()
    public coordinates?: number[];
}