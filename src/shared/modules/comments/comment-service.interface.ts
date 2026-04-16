import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto.ts';
import { CommentEntity } from './comment.entity.ts';

export interface CommentService {
    create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
    findByCommentId(
        commentId: string
    ): Promise<DocumentType<CommentEntity> | null>
}
