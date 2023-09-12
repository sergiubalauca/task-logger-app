import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { WorkItem, WorkItemDto, WORK_ITEM_COLLECTION_NAME } from '@shared';
import { Observable, switchMap } from 'rxjs';

@Injectable()
export class WorkItemApiServce {
    private readonly apiURL = 'work-item';
    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private offlineManager: OfflineManagerService
    ) {}

    public createWorkItem(workItem: WorkItem): Observable<WorkItemDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                const route = `${this.apiURL}/register`;
                if (status.isConnected) {
                    return this.httpService.makePost(route, {
                        name: workItem.name,
                        price: workItem.price,
                        description: workItem.description,
                    });
                } else {
                    return this.offlineManager.storeRequest(route, 'POST', {
                        name: workItem.name,
                        price: workItem.price,
                        description: workItem.description,
                        collection: WORK_ITEM_COLLECTION_NAME,
                    });
                }
            })
        );
    }

    public updateWorkItem(workItem: WorkItem): Observable<WorkItemDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                const route = `${this.apiURL}/${workItem.id}/update`;
                if (status.isConnected) {
                    return this.httpService.makePost(route, {
                        name: workItem.name,
                        price: workItem.price,
                        description: workItem.description,
                    });
                } else {
                    return this.offlineManager.storeRequest(route, 'POST', {
                        name: workItem.name,
                        price: workItem.price,
                        description: workItem.description,
                        collection: WORK_ITEM_COLLECTION_NAME,
                    });
                }
            })
        );
    }

    public deleteWorkItem(workItemId: string): Observable<WorkItemDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                console.log('GSB: ', status);
                const route = `${this.apiURL}/${workItemId}`;
                if (status.isConnected) {
                    return this.httpService.makeDelete(route);
                } else {
                    return this.offlineManager.storeRequest(route, 'DELETE', {
                        collection: WORK_ITEM_COLLECTION_NAME,
                    });
                }
            })
        );
    }
}
