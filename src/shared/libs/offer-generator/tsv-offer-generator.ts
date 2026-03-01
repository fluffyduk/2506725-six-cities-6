import { OfferGenerator } from './offer-generator.interface.ts';
import { MockServerData } from '../../types/mock-server-data.type.ts';
import {
  generateRandomInteger,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.ts';
import { User } from '../../types/user.type.ts';
import dayjs from 'dayjs';

const MIN_PRICE = 100;
const MAX_PRICE = 2500;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomInteger(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewPath = getRandomItem<string>(this.mockData.previewImages);
    const photos = getRandomItems<string>(this.mockData.photos);
    const isPremium = Math.random() < 0.5;
    const isFavorite = Math.random() < 0.5;
    const rating = generateRandomInteger(1, 5, 1);
    const type = getRandomItem<string>(this.mockData.types);
    const roomsCount = generateRandomInteger(1, 5);
    const guestsCount = generateRandomInteger(1, 10);
    const price = generateRandomInteger(MIN_PRICE, MAX_PRICE);
    const conveniences = getRandomItems<string>(this.mockData.features);
    const author = getRandomItem<User>(this.mockData.users);
    const commentsCount = generateRandomInteger(3, 15);
    const coordinates: [number, number] = [
      generateRandomInteger(0, 90, 6),
      generateRandomInteger(0, 180, 6),
    ];

    return [
      title,
      description,
      postDate,
      city,
      previewPath,
      photos.join(';'),
      isPremium,
      isFavorite,
      rating,
      type,
      roomsCount,
      guestsCount,
      price,
      conveniences.join(';'),
      commentsCount,
      `${author.name};${author.email};${author.avatar};${author.password};${author.type}`,
      `${coordinates[0]};${coordinates[1]}`
    ].join('\t');
  }
}
