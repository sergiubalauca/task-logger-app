import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '@shared';
import { HttpOperations, HttpService } from '../../api';
import { DoctorRepository } from '@database';

const STORAGE_REQ_KEY = 'storedreq';

interface StoredRequest {
    url: string;
    type: string;
    data: {
        collection: string;
    };
    time: number;
    id: string;
}

@Injectable({
    providedIn: 'root',
})
export class OfflineManagerService {
    private localRxDBStrategies = {
        doctor: this.doctorRepository,
        workItem: 'workItem',
        logWork: 'logWork'
    };
    constructor(
        private storage: Storage,
        private http: HttpClient,
        private httpService: HttpService,
        private toastService: ToastService,
        private doctorRepository: DoctorRepository,
    ) {}

    public checkForEvents(): Observable<any> {
        return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
            switchMap((storedOperations) => {
                const storedObj = JSON.parse(storedOperations);
                if (storedObj && storedObj.length > 0) {
                    return this.sendRequests(storedObj).pipe(
                        finalize(async () => {
                            await this.toastService.presentSuccess(
                                'Local data succesfully synced to API!',
                                3000
                            );

                            this.storage.remove(STORAGE_REQ_KEY);
                        })
                    );
                } else {
                    console.log('no local events to sync');
                    return of(false);
                }
            })
        );
    }

    public async storeRequest(url, type, data) {
        await this.toastService.presentError(
            'Your data is stored locally because you seem to be offline.',
            3000
        );

        const action: StoredRequest = {
            url,
            type,
            data,
            time: new Date().getTime(),
            id: Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, '')
                .substr(0, 5),
        };
        // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

        const storeOperations = await this.storage.get(STORAGE_REQ_KEY);
        let storedObj = JSON.parse(storeOperations);
        if (storedObj) {
            storedObj.push(action);
        } else {
            storedObj = [action];
        }

        // Save old & new local transactions back to Storage
        return await this.storage.set(
            STORAGE_REQ_KEY,
            JSON.stringify(storedObj)
        );
    }

    public sendRequests(operations: StoredRequest[]) {
        const obs: Observable<ArrayBuffer>[] = [];

        for (const op of operations) {
            console.log('Make one request: ', op);
            switch (op.type) {
                case HttpOperations.GET:
                    break;
                case HttpOperations.POST:
                    obs.push(this.httpService.makePost(op.url, op.data)
                        // .pipe(
                        //     switchMap((res) => {
                        //         // return this.localRxDBStrategies[op.data.collection].
                        //         const rxDBRepo = this.localRxDBStrategies[op.data.collection];
                        //         return of(rxDBRepo.editOne(op.data));
                        //     }),
                        // )
                    );
                    break;
                case HttpOperations.PATCH:
                    break;
                case HttpOperations.DELETE:
                    obs.push(this.httpService.makeDelete(op.url));
                    break;
                case HttpOperations.PUT:
                    break;

                default:
                    break;
            }
            // const oneObs = this.http.request(op.type, op.url, op.data);
            // obs.push(oneObs);
        }

        // Send out all local events and return once they are finished
        return forkJoin(obs);
    }
}
