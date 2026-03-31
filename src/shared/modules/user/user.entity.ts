import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType, UserTypeEnum } from '../../types/index.ts';
import { createSHA256 } from '../../helpers/index.ts';

export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this._password = userData.password;
    this.type = userData.type;
  }

    @prop({ unique: true, required: true, type: String })
  public email: string;

    @prop({ required: false, default: '', type: String })
    public avatar: string;

    @prop({ required: true, default: '', type: String })
    public name: string;

    @prop({
      required: true,
      type: String,
      enum: Object.values(UserTypeEnum)
    })
    public type: UserType;

    @prop({ required: true, default: '', type: String })
    private _password: string;

    public setPassword(password: string, salt: string) {
      this._password = createSHA256(password, salt);
    }

    public get password() {
      return this._password;
    }
}

export const UserModel = getModelForClass(UserEntity);
