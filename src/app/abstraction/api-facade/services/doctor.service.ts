/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { Doctor, DoctorDto, DOCTOR_COLLECTION_NAME } from '@shared';
import { Observable, Subject, of, switchMap } from 'rxjs';
import { SyncBaseService } from '../sync/sync-base.service';

@Injectable()
export class DoctorApiServce extends SyncBaseService {
    protected doneSubject: Subject<boolean> = new Subject<boolean>();

    private readonly apiURL = 'doctor';
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

    public getAllDoctors(): Observable<DoctorDto[]> {
        return of([]);
    }
}
