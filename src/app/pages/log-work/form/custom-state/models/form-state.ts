import { BehaviorSubject, Observable } from 'rxjs';

export interface FormState {
    currentDoctor: number;
    currentPacient: number;
}

export type Reducer = {
    initialState?: FormState;
    currentDoctor?: BehaviorSubject<FormState>;
    currentPacient$?: Observable<FormState>;
    setCurrentDoctor: (value: number) => void;
    setCurrentPacient: (value: number) => void;
    reset: () => void;
};

export interface Selector {
    currentDoctor$: Observable<number>;
    currentPacient$: Observable<number>;
}
