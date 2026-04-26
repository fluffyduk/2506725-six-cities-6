import { Expose } from 'class-transformer';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public price: number;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: string;
}
