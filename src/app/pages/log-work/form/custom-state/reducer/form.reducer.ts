import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormState, Reducer, StateSubject } from '../models';

@Injectable()
export class FormReducer implements Reducer {
    readonly initialState: FormState = {
        currentDoctor: 0,
        currentPacient: 0,
    };

    formState: StateSubject<FormState> = new StateSubject<FormState>(
        this.initialState
    );

    public data$: Observable<FormState> = this.formState.value$;

    constructor() {}

    public setCurrentDoctor = (value: number): void => {
        this.formState.next({
            ...this.formState.value,
            currentDoctor: value,
        });
    };

    public setCurrentPacient = (value: number): void => {
        this.formState.update({
            ...this.formState.value,
            currentPacient: value,
        });
    };

    public reset = (): void => {
        this.formState.reset();
    };
}
