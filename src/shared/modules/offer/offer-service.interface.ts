import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
    create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
    findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
    findByOfferName(offerName: string): Promise<DocumentType<OfferEntity> | null>;
    findByOfferNameOrCreate(
        offerName: string,
        dto: CreateOfferDto
    ): Promise<DocumentType<OfferEntity>>;
}
