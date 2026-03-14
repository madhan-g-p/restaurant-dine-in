import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message };

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Internal server error';

    const errorBody =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).error || null
        : null;

    const errorResponse: ApiResponse = {
      status: false,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
      error: errorBody || (status === 500 ? 'Internal Server Error' : message),
    };

    this.logger.error(
      `${request.method} ${request.url} ${status} - Error: ${JSON.stringify(
        errorResponse,
      )}`,
    );

    response.status(status).json(errorResponse);
  }
}
