import z from "zod";

const ConfigSchema = z.object({
  NEXT_PUBLIC_AUTH_URL: z.string().url().default("http://auth-service:3004"),
  NEXT_PUBLIC_ORDER_URL: z.string().url().default("http://orders-service:3000"),
  NEXT_PUBLIC_PAYMENTS_URL: z.string().url().default("http://payments-service:3003"),
  PORT: z.coerce.number().default(4000),
});

const envVars = {
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_ORDER_URL: process.env.NEXT_PUBLIC_ORDER_URL,
  NEXT_PUBLIC_PAYMENTS_URL: process.env.NEXT_PUBLIC_PAYMENTS_URL,
  PORT: process.env.PORT,
};

const parsed = ConfigSchema.safeParse(envVars);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[ConfigEnv] Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

const envConfig = parsed.data;
export default envConfig; 