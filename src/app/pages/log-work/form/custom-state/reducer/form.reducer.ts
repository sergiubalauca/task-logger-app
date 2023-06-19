import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormState, Reducer } from '../models';

@Injectable()
export class FormReducer implements Reducer {
    readonly initialState: FormState = {
        currentDoctor: 0,
        currentPacient: 0,
    };

    formState: BehaviorSubject<FormState> = new BehaviorSubject<FormState>(
        this.initialState
    );

    public data$: Observable<FormState> = this.formState.asObservable();

    constructor() {}

    public setCurrentDoctor = (value: number): void => {
        this.formState.next({
            ...this.formState.value,
            currentDoctor: value,
        });
    };

    public setCurrentPacient = (value: number): void => {
        this.formState.next({
            ...this.formState.value,
            currentPacient: value,
        });
    };

    public reset = (): void => {
        this.formState.next(this.initialState);
    };
}
