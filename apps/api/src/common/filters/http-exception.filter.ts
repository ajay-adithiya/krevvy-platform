import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = 'Internal server error';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseBody = exceptionResponse as Record<string, unknown>;

        if (Array.isArray(responseBody.message)) {
          message = 'Validation failed';
          errors = responseBody.message as string[];
        } else if (typeof responseBody.message === 'string') {
          message = responseBody.message;
        }
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}