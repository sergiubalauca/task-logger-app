/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { DailyWork, DailyWorkDto, LOGWORK_COLLECTION_NAME } from '@shared';
import { Observable, switchMap } from 'rxjs';
import { SyncBaseService } from '../sync/sync-base.service';

@Injectable()
export class LogWorkApiService extends SyncBaseService {
    private readonly apiURL = 'log-work';

    public done$: Observable<boolean> = this.doneSubject.asObservable();
    public startSyncing(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private offlineManager: OfflineManagerService
    ) {
        super();
    }

    public createDailyWork(dailyWork: DailyWork): Observable<DailyWorkDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                const route = `${this.apiURL}/register`;
                if (status.isConnected) {
                    return this.httpService.makePost(route, {
                        dailyWork,
                    });
                } else {
                    return this.offlineManager.storeRequest(route, 'POST', {
                        dailyWork,
                        collection: LOGWORK_COLLECTION_NAME,
                    });
                }
            })
        );
    }

    public updateDailyWork(dailyWork: DailyWork): Observable<DailyWorkDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                const route = `${this.apiURL}/${dailyWork.id}/update`;
                if (status.isConnected) {
                    return this.httpService.makePost(route, {
                        dailyWork,
                    });
                } else {
                    return this.offlineManager.storeRequest(route, 'POST', {
                        dailyWork,
                        collection: LOGWORK_COLLECTION_NAME,
                    });
                }
            })
        );
    }
}
