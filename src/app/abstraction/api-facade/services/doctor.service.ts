import { Injectable } from '@angular/core';
import {
    ConnectivityStateService,
    HttpService,
    OfflineManagerService,
} from '@core';
import { Doctor } from '@shared';
import { Observable, switchMap } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable()
export class DoctorApiServce {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private readonly API_STORAGE_KEY = 'doctor-storage-key';
    private readonly apiURL = 'doctor';
    constructor(
        private httpService: HttpService,
        private networkService: ConnectivityStateService,
        private storage: Storage,
        private offlineManager: OfflineManagerService
    ) {}

    public getUserById(id: string) {
        return this.httpService.makeGet(`${this.apiURL}/getById/${id}`);
    }

    public createDoctor(doctor: Doctor): Observable<any> {
        return this.networkService.connectivity$.pipe(
            switchMap((status) => {
                if (status.isConnected) {
                    return this.httpService.makePost(
                        `${this.apiURL}/register`,
                        {
                            name: doctor.name,
                            phone: doctor.phone,
                        }
                    );
                } else {
                    return this.offlineManager.storeRequest(
                        `${this.apiURL}/register`,
                        'POST',
                        {
                            name: doctor.name,
                            phone: doctor.phone,
                        }
                    );
                }
            })
        );
        // if (
        //     this.networkService.getCurrentNetworkStatus() ==
        //         ConnectionStatus.Offline ||
        //     !forceRefresh
        // ) {
        //     // Return the cached data from Storage
        //     return from(this.getLocalData('users'));
        // } else {
        //     // Just to get some "random" data
        //     let page = Math.floor(Math.random() * Math.floor(6));
        //     // Return real API data and store it locally
        //     return this.http
        //         .get(`${API_URL}/users?per_page=2&page=${page}`)
        //         .pipe(
        //             map((res) => res['data']),
        //             tap((res) => {
        //                 this.setLocalData('users', res);
        //             })
        //         );
        // }
    }

    private setLocalData(key, data) {
        this.storage.set(`${this.API_STORAGE_KEY}-${key}`, data);
    }

    // Get cached API result
    private getLocalData(key) {
        return this.storage.get(`${this.API_STORAGE_KEY}-${key}`);
    }
}
