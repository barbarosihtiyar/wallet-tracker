export const is_Dev = process.env.NODE_ENV === 'development';

export enum EnvironmentTypes {
  Development = 'development',
  Production = 'production',
  Maintenance = 'maintenance',
}

export const backendPrefix = {};
