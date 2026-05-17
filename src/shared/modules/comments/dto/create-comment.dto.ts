import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.message.ts';

export class CreateCommentDto {
    @IsMongoId({message: CreateCommentValidationMessage.authorId.invalidFormat})
  public authorId: string;

    @IsString({message: CreateCommentValidationMessage.text.invalidFormat})
    @Length(5, 1024, {message: CreateCommentValidationMessage.text.invalidLength})
    public text: string;

    @IsInt()
    @Min(1)
    @Max(5)
    public rating: number;

    @IsMongoId({message: CreateCommentValidationMessage.offerId.invalidFormat})
    public offerId: string;
}
