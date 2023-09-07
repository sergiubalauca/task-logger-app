import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenProvider } from './token-provider';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private tokenProvider: TokenProvider) {}
    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (
            req.url.indexOf('/auth/login') > -1 ||
            req.url.indexOf('/auth/refresh') > -1
        ) {
            return next.handle(req);
        }

        const authenticationResult = this.tokenProvider.getToken();

        if (!authenticationResult) {
            return next.handle(req);
        }

        const authReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + authenticationResult.accessToken
            ),
        });

        return next.handle(authReq);
    }
}
