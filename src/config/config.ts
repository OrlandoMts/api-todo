export interface ConfigItf {
  environment: string;
  mongodb: string;
  port: number;
  saltRounds: number;
}

export const EnvConfiguration = (): ConfigItf => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: +process.env.PORT || 3000,
  saltRounds: +process.env.SALT_SYNC || 10,
});
