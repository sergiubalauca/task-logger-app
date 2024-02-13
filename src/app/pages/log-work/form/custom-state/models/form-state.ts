import { BehaviorSubject, Observable } from 'rxjs';

export interface FormState {
    currentDoctor: number;
    currentDoctorBreadcrumb: string;
    currentPacient: number;
    currentPacientBreadcrumb: string;
    formAlreadySavedForDate: boolean;
}

export type Reducer = {
    initialState?: FormState;
    currentDoctor?: BehaviorSubject<FormState>;
    currentPacient$?: Observable<FormState>;
    formAlreadySavedForDate?: Observable<boolean>;
    setCurrentDoctor: (value: number) => void;
    setCurrentDoctorBreadcrumb: (value: string) => void;
    setCurrentPacient: (value: number) => void;
    setCurrentPacientBreadcrumb: (value: string) => void;
    setFormAlreadySavedForDate: (value: boolean) => void;
    reset: () => void;
};

export interface Selector {
    currentDoctor$: Observable<number>;
    currentDoctorBreadcrumb$: Observable<string>;
    currentPacient$: Observable<number>;
    currentPacientBreadcrumb$: Observable<string>;
    formAlreadySavedForDate$: Observable<boolean>;
}
