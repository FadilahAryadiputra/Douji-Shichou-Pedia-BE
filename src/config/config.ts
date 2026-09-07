import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

export const NODE_ENV = process.env.NODE_ENV || "development";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = NODE_ENV === "development" ? ".env.development" : ".env";

config({
  path: resolve(__dirname, `../${envFile}`),
});

config({
  path: resolve(__dirname, `../${envFile}.local`),
  override: true,
});

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || ""