import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { DailyWork, DailyWorkDto, LOGWORK_COLLECTION_NAME } from '@shared';
import { Observable, switchMap } from 'rxjs';

@Injectable()
export class LogWorkApiServce {
    private readonly apiURL = 'log-work';
    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private offlineManager: OfflineManagerService
    ) {}

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
