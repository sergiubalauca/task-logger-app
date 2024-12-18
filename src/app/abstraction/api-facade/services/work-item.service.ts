/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
    StoredRequestInput,
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

        console.time('Work Items rxdb duration');

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

        await this.workItemFacade.deleteAll();
        for (const workItem of workItems) {
            await this.workItemFacade.addOne({
                ...workItem,
                mongoId: workItem.id,
            });
        }
        this.doneSubject.next(true);

        console.timeEnd('Work Items rxdb duration');
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
                    const storedRequest: StoredRequestInput = {
                        url: route,
                        type: 'POST',
                        data: {
                            name: workItem.name,
                            price: workItem.price,
                            description: workItem.description,
                            collection: WORK_ITEM_COLLECTION_NAME,
                        },
                    };

                    return this.offlineManager.storeRequest(storedRequest);
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
                    const storedRequest: StoredRequestInput = {
                        url: route,
                        type: 'POST',
                        data: {
                            name: workItem.name,
                            price: workItem.price,
                            description: workItem.description,
                            collection: WORK_ITEM_COLLECTION_NAME,
                        },
                    };

                    return this.offlineManager.storeRequest(storedRequest);
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
                    const storedRequest: StoredRequestInput = {
                        url: route,
                        type: 'DELETE',
                        data: {
                            collection: WORK_ITEM_COLLECTION_NAME,
                        },
                    };

                    return this.offlineManager.storeRequest(storedRequest);
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
                        if (res.errors && res.errors.length > 0) {
                            throw new Error(res.errors[0].message);
                        }
                        return res.data?.workItems;
                    })
                )
        );
    }
}
