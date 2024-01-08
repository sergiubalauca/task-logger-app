/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
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

        console.time('Work Items rxdb duration');

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
                              patientGroup{
                                patientArray{
                                  patient
                                  workItemGroup{
                                    workItemAndNumber{
                                      numberOfWorkItems
                                      workItem
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
                // ...dailyWork,
                // mongoId: dailyWork.id,
            });
        }
        this.doneSubject.next(true);

        console.timeEnd('Work Items rxdb duration');
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
