/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { Doctor, DoctorDto, DOCTOR_COLLECTION_NAME } from '@shared';
import { Observable, Subject, firstValueFrom, map, of, switchMap } from 'rxjs';
import { SyncBaseService } from '../sync/sync-base.service';
import { DoctorFacade } from '../../database';

@Injectable()
export class DoctorApiServce extends SyncBaseService {
    protected doneSubject: Subject<boolean> = new Subject<boolean>();

    private readonly apiURL = 'doctor';
    public done$: Observable<boolean> = this.doneSubject.asObservable();
    public async startSyncing(): Promise<void> {
        this.doneSubject.next(false);

        console.time('/Work Items api duration');

        const doctors = await this.graphqlQuery({
            query: `
                query {
                    doctors(filters:{ }) {
                        name, phone, id
                      }
                }
                `,
            filters: {},
        });
        console.timeEnd('/Doctors api duration');
        console.time('/Doctors rxdb duration');

        await this.doctorFacade.deleteAll();
        for (const doctor of doctors) {
            await this.doctorFacade.addOne({
                ...doctor,
                mongoId: doctor.id,
            });
        }
        this.doneSubject.next(true);

        console.timeEnd('Doctors rxdb duration');
    }

    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private offlineManager: OfflineManagerService,
        private doctorFacade: DoctorFacade
    ) {
        super();
    }

    public createDoctor(doctor: Doctor): Observable<DoctorDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                console.log('GSB: ', status);
                const route = `${this.apiURL}/register`;
                if (status.isConnected) {
                    return this.httpService.makePost(route, {
                        name: doctor.name,
                        phone: doctor.phone,
                    });
                } else {
                    return this.offlineManager.storeRequest(route, 'POST', {
                        name: doctor.name,
                        phone: doctor.phone,
                        collection: DOCTOR_COLLECTION_NAME,
                    });
                }
            })
        );
    }

    public updateDoctor(doctor: Doctor): Observable<DoctorDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                console.log('GSB: ', status);
                const route = `${this.apiURL}/${doctor.id}/update`;
                if (status.isConnected) {
                    return this.httpService.makePost(route, {
                        name: doctor.name,
                        phone: doctor.phone,
                    });
                } else {
                    return this.offlineManager.storeRequest(route, 'POST', {
                        name: doctor.name,
                        phone: doctor.phone,
                        collection: DOCTOR_COLLECTION_NAME,
                    });
                }
            })
        );
    }

    public deleteDoctor(doctorId: string): Observable<DoctorDto> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                console.log('GSB: ', status);
                const route = `${this.apiURL}/${doctorId}`;
                if (status.isConnected) {
                    return this.httpService.makeDelete(route);
                } else {
                    return this.offlineManager.storeRequest(route, 'DELETE', {
                        collection: DOCTOR_COLLECTION_NAME,
                    });
                }
            })
        );
    }

    public async graphqlQuery<T>(options: {
        query: string;
        filters?: { [key: string]: any };
    }): Promise<DoctorDto[]> {
        return await firstValueFrom(
            this.httpService
                .makeGraphqlPost<
                    DoctorDto[],
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
                        return res.data?.doctors;
                    })
                )
        );
    }
}
