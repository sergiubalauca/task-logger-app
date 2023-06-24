import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';
import {
    withInterceptorsFromDi,
    provideHttpClient,
} from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { pageTransitionAnimations } from '@shared';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { CoreModule } from './app/core/core.module';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            IonicModule.forRoot({
                navAnimation: pageTransitionAnimations,
            }),
            AppRoutingModule,
            CommonModule,
            CoreModule
        ),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideHttpClient(withInterceptorsFromDi()),
    ],
}).catch((err) => console.log(err));
