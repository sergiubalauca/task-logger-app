/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { WorkItem, WorkItemDto, WORK_ITEM_COLLECTION_NAME } from '@shared';
import { Observable, firstValueFrom, map, switchMap } from 'rxjs';
import { SyncBaseService } from '../sync/sync-base.service';
import { WorkItemFacade } from '../../database';

@Injectable()
export class WorkItemApiServce extends SyncBaseService {
    public done$: Observable<boolean> = this.doneSubject.asObservable();

    public async startSyncing(): Promise<void> {
        this.doneSubject.next(false);

        console.time('/Work Items api duration');

        const workItems = await this.graphqlQuery({
            query: `
                query {
                    workItems(filters: {  }){
                        name, price, description, id
                      }
                }
                `,
            filters: {},
        });
        console.timeEnd('/Work Items api duration');
        console.time('/Work Items rxdb duration');

        await this.workItemFacade.deleteAll();
        for (const workItem of workItems) {
            await this.workItemFacade.addOne({
                ...workItem,
                mongoId: workItem.id,
            });
        }
        this.doneSubject.next(true);

        console.timeEnd('/Work Items rxdb duration');
    }

    private readonly apiURL = 'work-item';

    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private offlineManager: OfflineManagerService,
        private workItemFacade: WorkItemFacade
    ) {
        super();
    }

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

    public async graphqlQuery<T>(options: {
        query: string;
        filters?: { [key: string]: any };
    }): Promise<WorkItemDto[]> {
        return await firstValueFrom(
            this.httpService
                .makeGraphqlPost<
                    WorkItemDto[],
                    {
                        query: string;
                        filters?: { [key: string]: any };
                    }
                >({
                    query: options.query,
                    filters: options.filters,
                })
                .pipe(
                    map((res) => {
                        const x = 1;
                        return res.data?.workItems;
                    })
                )
        );
    }
}
