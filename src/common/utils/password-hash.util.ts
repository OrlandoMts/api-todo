import { genSaltSync, hashSync } from 'bcryptjs';

export const encryptPassword = (input: string): string => {
  const saltRounds = process.env.SALT_SYNC;
  const salt = genSaltSync(+saltRounds);
  return hashSync(input, salt);
};
