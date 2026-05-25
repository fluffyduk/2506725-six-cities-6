import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Response, Request } from 'express';
import { CreateOfferDto, OfferService, UpdateOfferDto } from './index.js';
import { fillDTO, getId } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferRequest } from './requests/create-offer-request.type.js';
import { PatchOfferRequest } from './requests/patch-offer-request.type.js';
import { UserService } from '../user/user-service.interface.ts';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.OfferService) private readonly offerService: OfferService,
        @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [new ValidateObjectMiddleware('offerId'), new DocumentExistsMiddleware(offerService, 'Offer', 'offerId')],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.patch,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(offerService, 'Offer', 'offerId')
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectMiddleware('offerId'),
        new DocumentExistsMiddleware(offerService, 'Offer', 'offerId')
      ],
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.postFavorite,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });

    this.addRoute({
      path: '/me/favorites',
      method: HttpMethod.Get,
      handler: this.favorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    let favoriteIds: string[] = [];
    if (req.tokenPayload) {
      favoriteIds = await this.userService.getFavoriteIds(req.tokenPayload.id);
    }

    const offerWithFavotiresFlag = offers.map((offer) => {
      const offerObject = offer.toObject();
      return {
        ...offerObject,
        isFavorite: favoriteIds.includes(offerObject._id.toString()),
      };
    });
    const responseData = fillDTO(OfferRdo, offerWithFavotiresFlag);
    this.ok(res, responseData);
  }

  public async create(
    req: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const existOffer = await this.offerService.findByOfferName(req.body.name);

    if (existOffer) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Предложение ${req.body.name}» существует.`,
        'OfferController'
      );
    }
    const result = await this.offerService.create({
      ...req.body,
      authorId: req.tokenPayload.id,
    });
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async get(req: Request, res: Response): Promise<void> {
    this.logger.info('req.params:', req.params);
    this.logger.info('req.url:', req.url);
    const id = getId(req.params);
    const offer = await this.offerService.findByOfferId(id);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async patch(req: PatchOfferRequest, res: Response): Promise<void> {
    const id = getId(req.params);
    const result = await this.offerService.updateById(id, req.body);
    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async delete(req: PatchOfferRequest, res: Response): Promise<void> {
    const id = getId(req.params);
    const result = await this.offerService.deleteById(id);
    this.ok(res, result);
  }

  public async getPremium(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async postFavorite(req: Request, res: Response): Promise<void> {
    const offerId = getId(req.params);
    await this.userService.addFavorite(req.tokenPayload.id, offerId);
    return this.ok(res, { message: 'Оффер добавлен в избранное' });
  }

  public async deleteFavorite(req: Request, res: Response): Promise<void> {
    const offerId = getId(req.params);
    await this.userService.deleteFavorite(req.tokenPayload.id, offerId);
    return this.ok(res, { message: 'Оффер удален из избранного' });
  }

  public async favorites(req: Request, res: Response): Promise<void> {
    const result = await this.userService.getFavorites(req.tokenPayload.id);
    this.ok(res, result);
  }
}
