import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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

    private lastSyncDateSubject = new BehaviorSubject(new Date());
    public lastSyncDate$ = this.lastSyncDateSubject.asObservable();

    constructor() {}

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
        } finally {
            this.isSyncingSubject.next(false);
        }
    }
}
