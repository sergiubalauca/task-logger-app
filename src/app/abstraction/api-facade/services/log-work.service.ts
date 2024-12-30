/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
    StoredRequestInput,
} from '@core';
import { DailyWork, DailyWorkDto, LOGWORK_COLLECTION_NAME } from '@shared';
import { Observable, firstValueFrom, map, switchMap } from 'rxjs';
import { SyncBaseService } from '../sync/sync-base.service';
import { DailyWorkFacade } from '../../database';

@Injectable()
export class LogWorkApiService extends SyncBaseService {
    private readonly apiURL = 'log-work';

    public done$: Observable<boolean> = this.doneSubject.asObservable();
    public async startSyncing(): Promise<void> {
        this.doneSubject.next(false);

        console.time('Daily Works rxdb duration');

        const dailyWorks = await this.graphqlQuery({
            query: `
                query {
                    dailyWorks(filters:{  }){
                        userId,
                        rxdbId,
                        id
                        dailyWork {
                          id,
                          isPartiallySaved,
                          doctorGroup {
                            doctorArray{
                              doctor
                              mongoId
                              patientGroup{
                                patientArray{
                                  patient
                                  workItemGroup{
                                    workItemProps{
                                      numberOfWorkItems
                                      mongoId
                                      workItem
                                      color
                                      comment
                                    }
                                  }
                                }
                              }
                            }
                          }
                          timeGroup {
                            startTime
                            endTime
                            breaks {
                                startTime
                                endTime
                            }
                          }
                        }
                      }
                }
                `,
            filters: {},
        });

        await this.dailyWorkFacade.deleteAll();
        for (const dailyWork of dailyWorks) {
            await this.dailyWorkFacade.editOne({
                dailyId: dailyWork.rxdbId,
                dailyWork: dailyWork.dailyWork,
                mongoId: dailyWork.id,
            });
        }
        this.doneSubject.next(true);

        console.timeEnd('Daily Works rxdb duration');
    }
    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private offlineManager: OfflineManagerService,
        private dailyWorkFacade: DailyWorkFacade
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
                    const storedRequest: StoredRequestInput = {
                        url: route,
                        type: 'POST',
                        data: {
                            dailyWork,
                            collection: LOGWORK_COLLECTION_NAME,
                        },
                    };

                    return this.offlineManager.storeRequest(storedRequest);
                }
            })
        );
    }

    public deleteDailyWork(id: string): Observable<DailyWorkDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                const route = `${this.apiURL}/${id}`;
                if (status.isConnected) {
                    return this.httpService.makeDelete(route);
                } else {
                    const storedRequest: StoredRequestInput = {
                        url: route,
                        type: 'DELETE',
                        data: {
                            collection: LOGWORK_COLLECTION_NAME,
                        },
                    };

                    return this.offlineManager.storeRequest(storedRequest);
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
                    const storedRequest: StoredRequestInput = {
                        url: route,
                        type: 'POST',
                        data: {
                            dailyWork,
                            collection: LOGWORK_COLLECTION_NAME,
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
    }): Promise<DailyWorkDto[]> {
        return await firstValueFrom(
            this.httpService
                .makeGraphqlPost<
                    DailyWorkDto[],
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
                        return res.data?.dailyWorks;
                    })
                )
        );
    }
}
