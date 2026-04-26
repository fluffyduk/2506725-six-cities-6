import { inject, injectable } from 'inversify';
import {
    BaseController,
    HttpError,
    HttpMethod,
    RequestParams,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Response, Request } from 'express';
import { OfferService } from './index.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { CreateOfferRequest } from './requests/create-offer-request.type.js';
import { PatchOfferRequest } from './requests/patch-offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
    constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.OfferService) private readonly offerService: OfferService
    ) {
        super(logger);

        this.logger.info('Register routes for OfferController…');

        this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

        this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Get,
            handler: this.get,
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Patch,
            handler: this.patch,
        });

        this.addRoute({
            path: '/:offerId',
            method: HttpMethod.Delete,
            handler: this.delete,
        });
    }

    public async index(_req: Request, res: Response): Promise<void> {
        const offers = await this.offerService.find();
        const responseData = fillDTO(OfferRdo, offers);
        this.ok(res, responseData);
    }

    public async create(
        { body }: CreateOfferRequest,
        res: Response
    ): Promise<void> {
        const existOffer = await this.offerService.findByOfferName(body.name);

        if (existOffer) {
            throw new HttpError(
                StatusCodes.UNPROCESSABLE_ENTITY,
                `Offer with name «${body.name}» exists.`,
                'OfferController'
            );
        }

        const result = await this.offerService.create(body);
        this.created(res, fillDTO(OfferRdo, result));
    }

    public async get(req: Request, res: Response): Promise<void> {
        this.logger.info('req.params:', req.params);
        this.logger.info('req.url:', req.url);
        const id = this.getId(req.params);
        const existOffer = await this.offerService.findByOfferId(id);
        if (!existOffer) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                `Offer with id «${id}» not found.`,
                'OfferController'
            );
        }
        const offer = await this.offerService.findByOfferId(id);
        const responseData = fillDTO(OfferRdo, offer);
        this.ok(res, responseData);
    }

    public async patch(req: PatchOfferRequest, res: Response): Promise<void> {
        const id = this.getId(req.params);

        const existOffer = await this.offerService.findByOfferId(id);
        if (!existOffer) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                `Offer with id «${id}» not found.`,
                'OfferController'
            );
        }

        const result = await this.offerService.updateById(id, req.body);
        this.ok(res, result);
    }

    public async delete(req: PatchOfferRequest, res: Response): Promise<void> {
        const id = this.getId(req.params);
        const existOffer = await this.offerService.findByOfferId(id);
        if (!existOffer) {
            throw new HttpError(
                StatusCodes.NOT_FOUND,
                `Offer with id «${id}» not found.`,
                'OfferController'
            );
        }
        const result = await this.offerService.deleteById(id);
        this.ok(res, result);
    }

    private getId(params: RequestParams): string {
        const { offerId } = params;
        if (typeof offerId !== 'string') {
            throw new Error();
        }
        return offerId;
    }
}