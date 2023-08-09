import { DoctorApiServce, UserProvider } from '@abstraction';
import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { AuthFacade } from '../abstraction/auth-facade';
import { LogWorkFacade, WorkItemFacade } from '../abstraction/database';
import { DoctorFacade } from '../abstraction/database/doctor.facade';
import { AlertService } from '../shared/alert';
import { ApiModule } from './api';
import { AuthModule } from './auth';
import { AuthenticationTokenProvider } from './auth/providers';
import { AuthGuardService } from './auth/services';
import { WebErrorHandlerModule } from './custom-error-handler/global-error.module';
import { RxDatabaseModule } from './database/rx-database.module';

@NgModule({
    declarations: [],
    imports: [
        WebErrorHandlerModule,
        RxDatabaseModule,
        ApiModule.forRoot({
            environment,
        }),
        AuthModule.forRoot({
            tokenProvider: AuthenticationTokenProvider,
        }),
    ],
    providers: [
        DoctorFacade,
        WorkItemFacade,
        LogWorkFacade,
        AuthGuardService,
        AlertService,
        AuthFacade,
        UserProvider,
        DoctorApiServce,
        Storage
    ],
})
export class CoreModule {}
