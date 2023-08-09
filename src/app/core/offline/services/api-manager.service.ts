import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

const STORAGE_REQ_KEY = 'storedreq';

interface StoredRequest {
    url: string;
    type: string;
    data: any;
    time: number;
    id: string;
}

@Injectable({
    providedIn: 'root',
})
export class OfflineManagerService {
    constructor(
        private storage: Storage,
        private http: HttpClient,
        private toastController: ToastController
    ) {}

    public checkForEvents(): Observable<any> {
        return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
            switchMap((storedOperations) => {
                const storedObj = JSON.parse(storedOperations);
                if (storedObj && storedObj.length > 0) {
                    return this.sendRequests(storedObj).pipe(
                        finalize(async () => {
                            const toast = await this.toastController.create({
                                message: `Local data succesfully synced to API!`,
                                duration: 3000,
                                position: 'bottom',
                            });
                            await toast.present();

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
        const toast = await this.toastController.create({
            message: `Your data is stored locally because you seem to be offline.`,
            duration: 3000,
            position: 'bottom',
        });
        await toast.present();

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
            const oneObs = this.http.request(op.type, op.url, op.data);
            obs.push(oneObs);
        }

        // Send out all local events and return once they are finished
        return forkJoin(obs);
    }
}
