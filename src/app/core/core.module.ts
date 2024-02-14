import {
    DoctorApiServce,
    LogWorkApiService,
    ReportsService,
    UserProvider,
    WorkItemApiServce,
} from '@abstraction';
import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { AuthFacade } from '../abstraction/auth-facade';
import {
    ColorFacade,
    DailyWorkFacade,
    LogWorkFacade,
    WorkItemFacade,
} from '../abstraction/database';
import { DoctorFacade } from '../abstraction/database/doctor.facade';
import { AlertService } from '../shared/alert';
import { ApiModule } from './api';
import { AuthModule } from './auth';
import { AuthenticationTokenProvider } from './auth/providers';
import { RefreshTokenProvider } from './auth/providers/refresh-token-provider.api';
import { AuthGuardService } from './auth/services';
import { WebErrorHandlerModule } from './custom-error-handler/global-error.module';
import { RxDatabaseModule } from './database/rx-database.module';
import { SyncService } from '../abstraction/api-facade/sync/sync.service';
import { SyncConfigurationService } from '../abstraction/api-facade/sync/sync-configuration.service';

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
            refreshTokenProvider: RefreshTokenProvider,
        }),
    ],
    providers: [
        DoctorFacade,
        WorkItemFacade,
        LogWorkFacade,
        DailyWorkFacade,
        AuthGuardService,
        AlertService,
        AuthFacade,
        UserProvider,
        DoctorApiServce,
        LogWorkApiService,
        WorkItemApiServce,
        SyncService,
        SyncConfigurationService,
        Storage,
        ReportsService,
        ColorFacade,
    ],
})
export class CoreModule {}
