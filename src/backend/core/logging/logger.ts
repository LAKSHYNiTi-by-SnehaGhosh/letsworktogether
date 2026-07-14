// Integration with existing src/lib/logger.ts
export const logger = {
  info: (obj: unknown, msg?: string) => console.log(msg || obj, typeof obj === 'string' ? '' : obj),
  error: (obj: unknown, msg?: string) => console.error(msg || obj, typeof obj === 'string' ? '' : obj),
  warn: (obj: unknown, msg?: string) => console.warn(msg || obj, typeof obj === 'string' ? '' : obj),
  debug: (obj: unknown, msg?: string) => console.debug(msg || obj, typeof obj === 'string' ? '' : obj),
};
