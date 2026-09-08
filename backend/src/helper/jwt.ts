import z from "zod";

export const jwtHeaderSchema = z.object({
    authorization: z
    .string({ error: "Authorization header is required" })
    .regex(/^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, {
      message: "Authorization invalid: Must be a valid Bearer JWT token",
    }),
});

const tokenWhitelist = new Set<string>();

export function registerToken(jti: string): void {
  tokenWhitelist.add(jti);
}

export function isRegistered(jti: string): boolean {
  return tokenWhitelist.has(jti);
}

export function revokeToken(jti: string): void {
  tokenWhitelist.delete(jti)
}