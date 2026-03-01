import {
  Offer,
  OfferCityType,
  OfferFeatureType,
  OfferType,
} from '../types/index.js';
import {
  OfferTypeEmum,
  OfferCityEnum,
  OfferFeatureEnum,
} from '../types/offer.type.js';
import { includes } from './common.js';

const isCoordinatesValid = (
  coordinates: unknown
): coordinates is [number, number] =>
  Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number' &&
    !isNaN(coordinates[0]) &&
    !isNaN(coordinates[1]);

const isOfferType = (type: string): type is OfferType =>
  includes(Object.values(OfferTypeEmum), type);

const isOfferCityType = (city: string): city is OfferCityType =>
  includes(Object.values(OfferCityEnum), city);

const isOfferFeatureType = (feature: string): feature is OfferFeatureType =>
  includes(Object.values(OfferFeatureEnum), feature);

export const createOffer = (line: string): Offer => {
  const [
    name,
    description,
    date,
    city,
    preview,
    images,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    price,
    features,
    user,
    coordinates,
  ] = line.split('\t');
  const [username, email, avatar, password] = user.split(';');
  const coord = coordinates.split(';').map(Number);
  const featuresArray = features.split(';');

  if (
    !isCoordinatesValid(coord) ||
        !isOfferType(type) ||
        !isOfferCityType(city) ||
        !featuresArray.every(isOfferFeatureType)
  ) {
    throw new Error(`Invalid offer data: ${line}`);
  }

  return {
    name,
    description,
    date: new Date(date),
    city,
    preview,
    images: images.split(';'),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type,
    rooms: parseInt(rooms, 10),
    guests: parseInt(guests, 10),
    price: parseInt(price, 10),
    features: featuresArray,
    user: {
      name: username,
      email,
      avatar,
      password,
    },
    coordinates: coord,
  };
};
