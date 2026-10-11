import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      role: Role;
      googleId?: string | null;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
