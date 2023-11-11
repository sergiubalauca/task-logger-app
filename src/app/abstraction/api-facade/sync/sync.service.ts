/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastDuration, ToastService } from '@shared';
import { SyncBaseService } from './sync-base.service';

@Injectable()
export class SyncService {
    private syncServices: Array<SyncBaseService> = new Array<SyncBaseService>();

    private isSyncingSubject = new BehaviorSubject(false);
    public isSyncing$ = this.isSyncingSubject.asObservable();

    private doneSyncs: Array<Observable<boolean>> = new Array<
        Observable<boolean>
    >();
    public doneSyncing$ = combineLatest(this.doneSyncs)
        .pipe(map((values) => values.every((v) => v === true)))
        .pipe(debounceTime(100), distinctUntilChanged());

    // improvement idea: should we store this value in localStorage as well or is good enough to keep it in memory
    private lastSyncDateSubject = new BehaviorSubject(new Date());
    public lastSyncDate$ = this.lastSyncDateSubject.asObservable();

    constructor(
        private toastService: ToastService,
        private translateService: TranslateService
    ) {}

    public addSyncService(syncService: SyncBaseService) {
        this.syncServices.push(syncService);
        this.doneSyncs.push(syncService.done$);
    }

    public async startSync(): Promise<void> {
        try {
            if (this.isSyncingSubject.value) {
                return;
            }

            this.isSyncingSubject.next(true);

            for (const service of this.syncServices) {
                await service.startSyncing();
            }

            this.lastSyncDateSubject.next(new Date());
        } catch (error) {
            console.error(error);
            this.toastService.presentError(
                this.translateService.instant('errorCodes.RXDB_SYNC'),
                ToastDuration.slow
            );
        } finally {
            this.isSyncingSubject.next(false);
        }
    }
}
