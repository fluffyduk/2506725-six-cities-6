import { Expose } from 'class-transformer';

export class UploadUserAvatarRdo {
    @Expose()
  public avatar: string;
}
