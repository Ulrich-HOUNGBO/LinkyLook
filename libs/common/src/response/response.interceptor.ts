import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Request, Response } from 'express';
import safeStringify from 'fast-safe-stringify';
import { instanceToPlain } from 'class-transformer';

interface ErrorResponse {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { method, url } = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const start = Date.now();

    return next.handle().pipe(
      map((data: T) => {
        this.logger.log(`Response: ${method} ${url} – ${Date.now() - start}ms`);
        const serializedData = instanceToPlain(data);
        return {
          statusCode: res.statusCode,
          timestamp: new Date().toISOString(),
          data: serializedData,
        };
      }),
      catchError((err: Error | HttpException) => {
        this.logger.error(
          `Error: ${method} ${url} – ${Date.now() - start}ms – ${err.message}`,
        );

        const status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse =
          err instanceof HttpException ? err.getResponse() : null;

        const message =
          errorResponse &&
          typeof errorResponse === 'object' &&
          'message' in errorResponse
            ? (errorResponse as ErrorResponse).message
            : err.message;

        const error =
          errorResponse &&
          typeof errorResponse === 'object' &&
          'error' in errorResponse
            ? (errorResponse as ErrorResponse).error
            : 'Internal Server Error';

        throw new HttpException(
          {
            statusCode: status,
            timestamp: new Date().toISOString(),
            error,
            message,
          },
          status,
        );
      }),
    );
  }

  errorHandler(
    exception: Error | HttpException,
    context: ExecutionContext,
  ): Response {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: unknown = null;
    let message: string | string[] = exception.message;
    let error: string = 'Internal Server Error';

    if (exception instanceof HttpException) {
      errorResponse = exception.getResponse();
      if (typeof errorResponse === 'object' && errorResponse !== null) {
        const errorObj = errorResponse as Record<string, unknown>;
        if ('message' in errorObj) {
          message = errorObj.message as string | string[];
        }
        if ('error' in errorObj) {
          error = errorObj.error as string;
        }
      }
    } else {
      this.logger.error(`Unhandled error: ${exception.message}`);
      this.logger.error(exception.stack);
      message = 'Something went wrong';
    }

    const timestamp = new Date().toISOString();
    const errorObj = {
      statusCode: status,
      timestamp,
      error,
      message,
    };

    // Use the same safe approach as in responseHandler
    return response
      .status(status)
      .type('application/json')
      .send(safeStringify(errorObj));
  }

  responseHandler(
    res: unknown,
    context: ExecutionContext,
  ): Response<any, Record<string, any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = response.statusCode;
    const timestamp = new Date().toISOString();

    const result = {
      statusCode,
      timestamp,
      data: res,
    };

    // Use a custom response method instead of json()
    return response
      .status(statusCode)
      .type('application/json')
      .send(safeStringify(result));
  }
}
