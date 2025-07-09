import z from "zod";

const ConfigSchema = z.object({
  NEXT_PUBLIC_AUTH_URL: z.string().url().default("http://localhost:3004"),
  NEXT_PUBLIC_ORDER_URL: z.string().url().default("http://localhost:3000"),
  PORT: z.number().default(4000),
});

const envVars = {
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_ORDER_URL: process.env.NEXT_PUBLIC_ORDER_URL,
};

const parsed = ConfigSchema.safeParse(envVars);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[ConfigEnv] Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

const envConfig = parsed.data;
export default envConfig; 