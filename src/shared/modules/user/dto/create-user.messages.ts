export const CreateUserValidationMessages = {
  email: {
    invalidFormat: 'Некорректный формат почты!',
  },
  name: {
    required: 'Имя обязательно!',
    lengthField: 'Длина имени должна быть от 1 до 15',
  },

  password: {
    required: 'Пароль обязателен!',
    lengthField: 'Длина пароль должна быть от 6 до 12',
  },
  type: {
    invalidType: 'Тип должен быть Standart или Pro',
  },
} as const;