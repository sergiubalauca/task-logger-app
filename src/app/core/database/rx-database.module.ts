import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxDatabaseProvider } from './rx-database.provider';
import { DoctorRepository } from './repositories/doctor.repository';
import { LogWorkRepository, WorkItemRepository } from './repositories';
import { SyncConfigurationService } from 'src/app/abstraction/api-facade';

const appInitializer = (dbProvider: RxDatabaseProvider, syncService: SyncConfigurationService) => async () => {
    await dbProvider.createDatabase();
    await syncWithServer(syncService)();
};
const syncWithServer =
    (syncConfigurationService: SyncConfigurationService) => async () => {
        syncConfigurationService.configureSync();
        await syncConfigurationService.startSync();
    };

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        RxDatabaseProvider,
        DoctorRepository,
        WorkItemRepository,
        LogWorkRepository,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [RxDatabaseProvider, SyncConfigurationService],
        },
        // {
        //     provide: APP_INITIALIZER,
        //     useFactory: syncWithServer,
        //     deps: [SyncConfigurationService],
        //     multi: true,
        // },
    ],
})
export class RxDatabaseModule {}
