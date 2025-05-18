import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hashedToken };
};

export const verifyToken = (token: string, hash: string) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return tokenHash === hash;
};
