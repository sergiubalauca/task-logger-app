import { BehaviorSubject, Observable } from 'rxjs';

export interface FormState {
    currentDoctor: number;
    currentPacient: number;
    formAlreadySavedForDate: boolean;
}

export type Reducer = {
    initialState?: FormState;
    currentDoctor?: BehaviorSubject<FormState>;
    currentPacient$?: Observable<FormState>;
    formAlreadySavedForDate?: Observable<boolean>;
    setCurrentDoctor: (value: number) => void;
    setCurrentPacient: (value: number) => void;
    setFormAlreadySavedForDate: (value: boolean) => void;
    reset: () => void;
};

export interface Selector {
    currentDoctor$: Observable<number>;
    currentPacient$: Observable<number>;
    formAlreadySavedForDate$: Observable<boolean>;
}
