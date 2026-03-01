import { OfferCityType, OfferFeatureType, OfferType } from './offer.type.ts';
import { UserType } from './user.type.ts';

export type MockServerData = {
    titles: string[];
    descriptions: string[];
    cities: OfferCityType[];
    previewImages: string[];
    photos: string[];
    types: OfferType[];
    features: OfferFeatureType[];
    users: {
        name: string;
        email: string;
        avatarPath: string;
        password: string;
        type: UserType;
    }[];
};
