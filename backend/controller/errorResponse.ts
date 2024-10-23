export class NotFound extends Error {
  statusCode: number;

  constructor(message: string | any) {
    super(message);
    this.name = "NotFound";
    this.statusCode = 404;
  }
}

export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string | any) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 422;
  }
}

export class UnexpectedError extends Error {
  statusCode: number;

  constructor(message: string | any) {
    super(message);
    this.name = "UnexpectedError";
    this.statusCode = 500;
  }
}

export class InvalidRequest extends Error {
  statusCode: number;

  constructor(message: string | any) {
    super(message);
    this.name = "InvalidRequest";
    this.statusCode = 422;
  }
}
