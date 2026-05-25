import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.ts';
import { PostFavotiteDto } from '../dto/post-favorite.dto.ts';

export type PostFavoriteRequest = Request<
    RequestParams,
    RequestBody,
    PostFavotiteDto
>;
