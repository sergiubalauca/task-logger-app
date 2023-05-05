import { Action, createReducer, on } from '@ngrx/store';
import * as FormActions from '../actions/form.actions';

export interface FormState {
    doctorIndex: number;
    patientIndex: number;
}

export const initialState: FormState = {
    doctorIndex: 0,
    patientIndex: 0,
};

export const formReducer = createReducer(
    initialState,
    on(FormActions.removePatientControl, (state, { doctorIndex }) => ({
        ...state,
        patientIndex: state.patientIndex - 1,
    })),
    on(FormActions.addPatientControl, (state, { doctorIndex }) => ({
        ...state,
        patientIndex: state.patientIndex + 1,
    })),
    on(FormActions.addDoctorControl, (state) => ({
        ...state,
        doctorIndex: state.doctorIndex + 1,
    })),

    on(FormActions.removeDoctorControl, (state, { doctorIndex }) => ({
        ...state,
        doctorIndex: state.doctorIndex - 1,
    })),
    on(FormActions.onDoctorSelected, (state, { doctorIndex }) => ({
        ...state,
        doctorIndex,
    })),
    on(FormActions.onGoToDoctor, (state, { doctorIndex }) => ({
        ...state,
        doctorIndex,
    })),
    on(FormActions.onGoToPatient, (state, { doctorIndex, patientIndex }) => ({
        ...state,
        doctorIndex,
        patientIndex,
    }))
);
