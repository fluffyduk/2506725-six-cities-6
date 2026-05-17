export const CreateCommentValidationMessage = {
    text: {
        invalidFormat: 'Текст должен быть строкой',
        invalidLength: 'Текст должен содержать от 5 до 1024 символов'
    },
    authorId: {
        invalidFormat: 'Поле authorId должно содержать валидный id'
    },
    offerId: {
        invalidFormat: 'Поле offerId должно содержать валидный id'
    }
} as const;