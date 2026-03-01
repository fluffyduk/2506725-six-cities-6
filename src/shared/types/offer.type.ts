import { User } from './user.type.js';

export const OfferCityEnum = {
  Paris: 'Paris',
  Cologne: 'Cologne',
  Brussels: 'Brussels',
  Amsterdam: 'Amsterdam',
  Hamburg: 'Hamburg',
  Dusseldorf: 'Dusseldorf',
} as const;
export type OfferCityType = (typeof OfferCityEnum)[keyof typeof OfferCityEnum];

export const OfferTypeEmum = {
  Apartment: 'Apartment',
  House: 'House',
  Room: 'Room',
  Hotel: 'Hotel',
} as const;
export type OfferType = (typeof OfferTypeEmum)[keyof typeof OfferTypeEmum];

export const OfferFeatureEnum = {
  Breakfast: 'Breakfast',
  AirConditioning: 'Air conditioning',
  LaptopFriendlyWorkspace: 'Laptop friendly workspace',
  BabySeat: 'Baby seat',
  Washer: 'Washer',
  Towels: 'Towels',
  Fridge: 'Fridge',
} as const;
export type OfferFeatureType =
    (typeof OfferFeatureEnum)[keyof typeof OfferFeatureEnum];

export type Offer = {
    name: string;
    description: string;
    date: Date;
    city: OfferCityType;
    preview: string;
    images: string[];
    isPremium: boolean;
    isFavorite: boolean;
    rating: number;
    type: OfferType;
    rooms: number;
    guests: number;
    price: number;
    features: OfferFeatureType[];
    user: User;
    coordinates: [number, number];
};
