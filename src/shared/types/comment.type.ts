import { User } from './user.type.ts';

export type CommentType = {
    text: string;
    date: Date;
    rating: number;
    authorId: string;
}
