import { Injectable } from '@angular/core';
import { SyncService } from './sync.service';
import {
    DoctorApiServce,
    LogWorkApiService,
    WorkItemApiServce,
} from '../services';

@Injectable()
export class SyncConfigurationService {
    constructor(
        private syncService: SyncService,
        private doctorSyncService: DoctorApiServce,
        private workItemSyncService: WorkItemApiServce,
        private logWorkSyncService: LogWorkApiService
    ) {}

    public configureSync(): void {
        this.syncService.addSyncService(this.doctorSyncService);
        this.syncService.addSyncService(this.workItemSyncService);
        // this.syncService.addSyncService(this.logWorkSyncService);
    }

    public async startSync(): Promise<void> {
        await this.syncService.startSync();
    }
}
