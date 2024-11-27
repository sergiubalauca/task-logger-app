import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpService } from './services';
import { HttpErrorInterceptor } from './interceptors';
import { ToastService } from '@shared';
import { EnvironmentConfig, ENV_CONFIG } from './environment-config.interface';

@NgModule({ declarations: [], imports: [CommonModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ApiModule {
    public static forRoot(
        config: EnvironmentConfig
    ): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [
                // HttpService, - it's provided in root
                ToastService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HttpErrorInterceptor,
                    multi: true,
                },
                {
                    provide: ENV_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}
