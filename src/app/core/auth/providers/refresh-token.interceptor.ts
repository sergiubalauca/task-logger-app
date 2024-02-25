import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, finalize, first, switchMap } from 'rxjs/operators';
import { TokenProvider } from './token-provider';
import { RefreshTokenProvider } from './refresh-token-provider.api';
import { AlertService, LogOutModel } from '@shared';
import { AuthService } from '../services';
import { ApiErrorCodes } from '../../api';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<string | null> =
        new BehaviorSubject<string | null>(null);

    constructor(
        private refreshTokenProvider: RefreshTokenProvider,
        private tokenProvider: TokenProvider,
        private alertService: AlertService,
        private authService: AuthService
    ) {}

    public intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error) => {
                if (
                    error.status !== 401 ||
                    request.url.indexOf('auth/login') > -1 ||
                    error.error.message === ApiErrorCodes.expiredRefreshToken
                ) {
                    throw error;
                }
                if (this.refreshTokenInProgress) {
                    return this.refreshTokenSubject.pipe(
                        filter((result) => result !== null),
                        first(),
                        switchMap((t) =>
                            next.handle(
                                this.addTokenToRequestHeader(request, t)
                            )
                        )
                    );
                } else {
                    this.refreshTokenInProgress = true;
                    this.refreshTokenSubject.next(null);

                    const tokens = this.tokenProvider.getToken();

                    return this.refreshTokenProvider.refreshToken(tokens).pipe(
                        switchMap((t: string) => {
                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(t);
                            return next.handle(
                                this.addTokenToRequestHeader(request, t)
                            );
                        }),
                        catchError(async (e: any) => {
                            this.refreshTokenInProgress = false;

                            if (
                                e.errorCode ===
                                    ApiErrorCodes.invalidRefreshToken ||
                                e.errorCode ===
                                    ApiErrorCodes.expiredRefreshToken ||
                                e.errorCode === ApiErrorCodes.invalidToken
                            ) {
                            }
                            const loggedInUser =
                                localStorage.getItem('USER_EMAIL');
                            const logOutModel: LogOutModel = {
                                email: loggedInUser,
                            };
                            await this.authService.forceLogout(logOutModel);
                            await this.showSessionExpiredAlert();
                            this.refreshTokenInProgress = false;

                            throw e;
                        }),
                        finalize(() => {
                            this.refreshTokenInProgress = false;
                        })
                    );
                }
            })
        );
    }

    private addTokenToRequestHeader(request, token) {
        return request.clone({
            setHeaders: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private async showSessionExpiredAlert(): Promise<void> {
        const okButton = {
            text: 'Ok',
            handler: () => {},
        };
        await this.alertService.presentAlert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [okButton],
            true
        );
    }
}
