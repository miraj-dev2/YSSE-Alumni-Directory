import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      name: string;
      role: Role;
      googleId: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
