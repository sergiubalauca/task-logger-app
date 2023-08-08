import {
    APP_INITIALIZER,
    enableProdMode,
    importProvidersFrom,
    Injector,
} from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import {
    withInterceptorsFromDi,
    provideHttpClient,
    HttpClient,
} from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { pageTransitionAnimations } from '@shared';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { CoreModule } from './app/core/core.module';
import {
    TranslateLoader,
    TranslateModule,
    TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserService } from './app/pages/playground/services';
import { PayLocationService } from './app/pages/playground/self/services/pay-location.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ConnectivityService } from './app/core/offline/services/connectivity.service';
import { ConnectivityStateService } from './app/core/offline/services/connectivity-state.service';

if (environment.production) {
    enableProdMode();
}

export const initUserProviderFactory = (provider: ConnectivityService) => () =>
    provider.startCheckConnectivity();

export const appInitializerFactory =
    (translate: TranslateService, injector: Injector) => () =>
        new Promise<any>((resolve: any) => {
            const locationInitialized = injector.get(
                LOCATION_INITIALIZED,
                Promise.resolve(null)
            );
            locationInitialized.then(() => {
                const langToSet = 'en';
                translate.setDefaultLang('en');
                translate.use(langToSet).subscribe(
                    () => {
                        // eslint-disable-next-line no-console
                        console.info(
                            `Successfully initialized '${langToSet}' language.'`
                        );
                    },
                    (err) => {
                        console.error(
                            `Problem with '${langToSet}' language initialization.'`
                        );
                    },
                    () => {
                        resolve(null);
                    }
                );
            });
        });

export const createTranslateLoader = (http: HttpClient) =>
    new TranslateHttpLoader(http, './assets/i18n/', '.json');

bootstrapApplication(AppComponent, {
    providers: [
        UserService,
        PayLocationService,
        importProvidersFrom(
            BrowserModule,
            IonicModule.forRoot({
                navAnimation: pageTransitionAnimations,
            }),
            AppRoutingModule,
            CommonModule,
            CoreModule,
            TranslateModule.forRoot({
                defaultLanguage: 'en',
                loader: {
                    provide: TranslateLoader,
                    useFactory: createTranslateLoader,
                    deps: [HttpClient],
                },
            })
        ),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: APP_INITIALIZER,
            useFactory: initUserProviderFactory,
            deps: [ConnectivityService, Network, ConnectivityStateService],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true,
        },
        TranslateService,
        Network,
        ConnectivityService,
        ConnectivityStateService,
    ],
}).catch((err) => console.log(err));
