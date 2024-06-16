export interface ConfigItf {
  environment: string;
  mongodb: string;
  port: number;
  saltRounds: number;
  jwtSecret: string;
  idClientG: string;
  secretClientG: string;
  callbackUrlG: string;
}

export const EnvConfiguration = (): ConfigItf => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: +process.env.PORT || 3000,
  saltRounds: +process.env.SALT_SYNC || 10,
  jwtSecret: process.env.JWT_SECRET,
  idClientG: process.env.ID_CLIENT_G,
  secretClientG: process.env.SECRET_CLIENT_G,
  callbackUrlG: process.env.CALLBACK_URL_G,
});
