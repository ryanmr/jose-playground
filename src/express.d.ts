import type { User } from "./types";

declare global {
  declare namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
