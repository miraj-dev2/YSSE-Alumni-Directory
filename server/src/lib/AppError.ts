export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: unknown): AppError {
    return new AppError(400, code, message, details);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED'): AppError {
    return new AppError(401, code, message);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN'): AppError {
    return new AppError(403, code, message);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND'): AppError {
    return new AppError(404, code, message);
  }

  static conflict(message = 'Conflict with current state', code = 'CONFLICT'): AppError {
    return new AppError(409, code, message);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_ERROR'): AppError {
    return new AppError(500, code, message);
  }
}
