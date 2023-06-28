/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { PayLocation } from '../models/pay-location.interface';

@Injectable()
export class PayLocationService {
    private selectedLocations: BehaviorSubject<PayLocation[]> =
        new BehaviorSubject([]);
    private readonly url =
        'https://graph.cloud.selfpay.ro/v2/opendata/terminal/locations';

    public get locationSelected$() {
        return this.selectedLocations.asObservable();
    }

    public selectedLocationsArr: PayLocation[] = [];

    constructor(private http: HttpClient) {}

    public getLocations(): Observable<PayLocation[]> {
        return this.http
            .get(this.url)
            .pipe(map((data: PayLocation[]) => data.slice(0, 50)));
    }

    public pushToLocationList(location: PayLocation): void {
        let existingVals: PayLocation[] = this.selectedLocations.getValue();
        const alreadyExists =
            existingVals &&
            existingVals.find((loc) => loc.name === location.name);

        if (alreadyExists) {
            existingVals = existingVals.filter(
                (vals) => vals.name !== alreadyExists.name
            );

            this.selectedLocations.next(existingVals);

            return;
        }

        this.selectedLocations.next([
            ...this.selectedLocations.value,
            location,
        ]);
    }
}
