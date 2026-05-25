import { IsString } from 'class-validator';

export class PostFavotiteDto {
  @IsString()
  public userId: string;

  @IsString()
  public offerId: string;
}
