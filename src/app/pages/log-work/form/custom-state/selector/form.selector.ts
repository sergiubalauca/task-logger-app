import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { FormState, Reducer, Selector } from '../models';
import { FormReducer } from '../reducer/form.reducer';

@Injectable()
export class FormSelector implements Selector {
    public currentDoctor$: Observable<number> = this.store.data$.pipe(
        map((state: FormState) => state.currentDoctor),
        shareReplay(1)
    );

    public currentPacient$: Observable<number> = this.store.data$.pipe(
        map((state: FormState) => state.currentPacient),
        shareReplay(1)
    );

    public formAlreadySavedForDate$: Observable<boolean> = this.store.data$.pipe(
        map((state: FormState) => state.formAlreadySavedForDate),
        shareReplay(1)
    );

    constructor(private readonly store: FormReducer) {}
}
