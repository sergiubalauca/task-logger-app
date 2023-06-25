import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { AuthenticationTokenProvider } from './providers';
import { TokenInterceptor } from './providers/token-interceptor';
import { TokenProvider } from './providers/token-provider';
import { AuthGuardService, AuthService, UserStorageService } from './services';

@NgModule({
    declarations: [],

    imports: [HttpClientModule],
})
export class AuthModule {
    public static forRoot(config: {
        tokenProvider: Type<TokenProvider>;
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
                    provide: TokenProvider,
                    useClass: config.tokenProvider,
                },
            ],
        };
    }
}
