import { inject } from "inversify";
import { CommentService } from "./comment-service.interface.ts";
import { Component } from "../../types/component.enum.ts";
import { Logger } from "../../libs/logger/logger.interface.ts";
import { DocumentType, types } from "@typegoose/typegoose";
import { CommentEntity } from "./comment.entity.ts";
import { CreateCommentDto } from "./dto/create-comment.dto.ts";

export class DefaultCommentService implements CommentService {
    constructor(
        @inject(Component.Logger) private readonly logger: Logger,
        @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
    ) { }

    create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
        const result = this.commentModel.create(dto);
        this.logger.info(`Создан новый комментарий: ${dto.text}`);
        return result;
    }

    findByCommentId(commentId: string): Promise<DocumentType<CommentEntity> | null> {
        return this.commentModel.findById(commentId).exec();
    }
};