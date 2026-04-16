import { ContainerModule } from "inversify";
import { CommentService } from "./comment-service.interface.ts";
import { Component } from "../../types/index.ts";
import { DefaultCommentService } from "./default-comment.service.ts";
import { types } from "@typegoose/typegoose";
import { CommentEntity, CommentModel } from "./comment.entity.ts";

export function createCommentContainer(): ContainerModule {
    const commentContainer = new ContainerModule(({ bind }) => {
        bind<CommentService>(Component.CommentService)
            .to(DefaultCommentService)
            .inSingletonScope();
        bind<types.ModelType<CommentEntity>>(
            Component.CommentModel
        ).toConstantValue(CommentModel);
    });
    return commentContainer;
};