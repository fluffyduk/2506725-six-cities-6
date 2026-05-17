import { inject, injectable } from 'inversify';
import { BaseController, HttpMethod, RequestBody, RequestParams, ValidateDtoMiddleware, ValidateObjectMiddleware } from '../../libs/rest/index.ts';
import { Component } from '../../types/component.enum.ts';
import { Logger } from '../../libs/logger/logger.interface.ts';
import { CommentService } from './comment-service.interface.ts';
import { CreateCommentDto } from './dto/create-comment.dto.ts';
import { Request, Response } from 'express';
import { fillDTO, getId } from '../../helpers/index.ts';
import { CommentRdo } from './rdo/comment.rdo.ts';

@injectable()
export class CommentController extends BaseController {
  constructor(
        @inject(Component.Logger) protected readonly logger: Logger,
        @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectMiddleware('offerId')],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectMiddleware('offerId'), new ValidateDtoMiddleware(CreateCommentDto)],
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
    const offerId = getId(req.params);
    const dto = { ...req.body, offerId};
    const result = await this.commentService.create(fillDTO(CommentRdo, dto));
    this.ok(res, result);
  }
}
