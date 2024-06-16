import { Role } from 'src/common/secure';

export interface UserGoogleItf {
  provider: string;
  email: string;
  username: string;
  role: Role;
}

export interface PayloadGoogleItf {
  user: UserGoogleItf;
  accessToken: string;
}
