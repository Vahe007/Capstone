import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic key for the access token authentication';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
