import { Offer } from './offer.type.js';

export type ParsedUser = {
    name: string;
    email: string;
    avatar: string;
    password: string;
    type: string;
};

export type ParsedLine = {
    offer: Omit<Offer, 'authorId'>;
    user: ParsedUser;
};