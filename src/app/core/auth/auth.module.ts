import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { UserStorageService } from '@shared';
import { AuthenticationTokenProvider } from './providers';
import { RefreshTokenProvider } from './providers/refresh-token-provider.api';
import { RefreshTokenInterceptor } from './providers/refresh-token.interceptor';
import { TokenInterceptor } from './providers/token.interceptor';
import { TokenProvider } from './providers/token-provider';
import { AuthGuardService, AuthService } from './services';

@NgModule({
    declarations: [],

    imports: [HttpClientModule],
})
export class AuthModule {
    public static forRoot(config: {
        tokenProvider: Type<TokenProvider>;
        refreshTokenProvider: Type<RefreshTokenProvider>;
    }): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                AuthenticationTokenProvider,
                UserStorageService,
                AuthGuardService,
                {
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: TokenInterceptor,
                },
                {
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useClass: RefreshTokenInterceptor,
                },
                {
                    provide: TokenProvider,
                    useClass: config.tokenProvider,
                },
                {
                    provide: RefreshTokenProvider,
                    useClass: config.refreshTokenProvider,
                },
            ],
        };
    }
}
