import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ErrorModelBuilder } from '../builders/error-model.builder';
import { ToastDuration, ToastService } from '@shared';
import { ApiErrorCodes, errorMapper } from '../models';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private toastService: ToastService) {}

    public intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse) {
                    const errorMessage = error.error.message || error.name;

                    const mappedErrorMessage = errorMapper(errorMessage);
                    const errorName = error.error.errorName || error.name;
                    const errorStatusCode = error.error.statusCode;

                    const errorModel = new ErrorModelBuilder()
                        .setErrorCode(errorName)
                        .setMessage(errorMessage)
                        .setStatus(errorStatusCode)
                        .build();

                    this.toastService.presentError(
                        mappedErrorMessage,
                        ToastDuration.slow
                    );
                    throw errorModel;
                }
                return throwError(() => new Error('Uncaught error'));
            })
        );
    }
}
