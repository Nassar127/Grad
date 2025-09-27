import 'dotenv/config';

const required = (key: string, val?: string) => {
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  DATABASE_URL: required('DATABASE_URL', process.env.DATABASE_URL),
  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET),
  GEMINI_API_KEY: required('GEMINI_API_KEY', process.env.GEMINI_API_KEY),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
