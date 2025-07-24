import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "../models";

export const db = drizzle(process.env.DB_FILE_NAME!, {
  schema,
});
