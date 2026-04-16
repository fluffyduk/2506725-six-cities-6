import { IsDateString, IsInt, IsMongoId, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsMongoId()
  public authorId: string;

    @IsString()
    public text: string;

    @IsInt()
    public rating: number;

    @IsDateString()
    public date: string;
}
