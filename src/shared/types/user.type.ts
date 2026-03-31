export const UserTypeEnum = {
  Standart: 'Standart',
  Pro: 'Pro',
} as const;
export type UserType = (typeof UserTypeEnum)[keyof typeof UserTypeEnum];

export type User = {
    name: string;
    email: string;
    avatar: string;
    password: string;
    type: UserType;
};
