import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, RequestBody, RequestParams, ValidateDtoMiddleware, ValidateObjectMiddleware } from '../../libs/rest/index.ts';
import { Component } from '../../types/component.enum.ts';
import { Logger } from '../../libs/logger/logger.interface.ts';
import { CommentService } from './comment-service.interface.ts';
import { CreateCommentDto } from './dto/create-comment.dto.ts';
import { Request, Response } from 'express';
import { fillDTO, getId } from '../../helpers/index.ts';
import { CommentRdo } from './rdo/comment.rdo.ts';
import { OfferService } from '../offer/offer-service.interface.ts';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class CommentController extends BaseController {
  constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.CommentService) private readonly commentService: CommentService,
        @inject(Component.OfferService) protected readonly offerService: OfferService
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectMiddleware('offerId'), new DocumentExistsMiddleware(offerService, 'Offer', 'offerId')],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(offerService, 'Offer', 'offerId')
      ],
    });
  }

  private async index(req: Request, res: Response) {
    const id = getId(req.params);
    const comments = await this.commentService.find(id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create(
    req: Request<RequestParams, RequestBody, CreateCommentDto>,
    res: Response
  ) {
    if (!(await this.offerService.documentExists(req.body.offerId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Предложения с id ${req.body.offerId} не существует`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({
      ...req.body,
      authorId: req.tokenPayload.id,
    });

    await this.offerService.incCommentCount(req.body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
