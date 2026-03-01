import { User } from './user.type.ts';

export type Comment = {
    text: string;
    createdAt: string;
    rating: number;
    author: User;
}
