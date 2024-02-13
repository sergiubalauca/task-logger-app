import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormState, Reducer, StateSubject } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Injectable()
export class FormReducer implements Reducer {
    readonly localStorageStateKey = 'formState';
    readonly initialState: FormState = {
        currentDoctor: 0,
        currentDoctorBreadcrumb: '',
        currentPacient: 0,
        currentPacientBreadcrumb: '',
        formAlreadySavedForDate: false,
    };

    formState: StateSubject<FormState> = new StateSubject<FormState>(
        this.initialState
    );

    public data$: Observable<FormState> = this.formState.value$;

    constructor() {
        this.hydrate();
        this.data$.pipe(takeUntilDestroyed()).subscribe((state) => {
            this.setHydration(state);
        });
    }

    public setCurrentDoctor = (value: number): void => {
        this.formState.next({
            ...this.formState.value,
            currentDoctor: value,
        });
    };

    public setCurrentDoctorBreadcrumb = (value: string): void => {
        this.formState.next({
            ...this.formState.value,
            currentDoctorBreadcrumb: value,
        });
    };

    public setCurrentPacient = (value: number): void => {
        this.formState.update({
            ...this.formState.value,
            currentPacient: value,
        });
    };

    public setCurrentPacientBreadcrumb = (value: string): void => {
        this.formState.update({
            ...this.formState.value,
            currentPacientBreadcrumb: value,
        });
    };

    public setFormAlreadySavedForDate = (value: boolean): void => {
        this.formState.update({
            ...this.formState.value,
            formAlreadySavedForDate: value,
        });
    };

    public reset = (): void => {
        this.formState.reset();
    };

    public setState = (value: FormState): void => {
        this.formState.update(value);
    };

    public hydrate = () => {
        const storageValue = localStorage.getItem(this.localStorageStateKey);
        if (storageValue) {
            try {
                const state = JSON.parse(storageValue);
                this.setState(state);
            } catch {
                localStorage.removeItem(this.localStorageStateKey);
            }
        }
    };

    public setHydration = <T>(value: T) => {
        localStorage.setItem(this.localStorageStateKey, JSON.stringify(value));
    };
}
