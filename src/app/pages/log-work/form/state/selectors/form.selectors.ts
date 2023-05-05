import { createSelector } from '@ngrx/store';

import { FormState } from '../reducers/form.reducers';

export const selectFormState = (state: { form: FormState }) => state.form;

export const selectDoctorIndex = createSelector(
    selectFormState,
    (state: FormState) => state.doctorIndex
);

export const selectPatientIndex = createSelector(
    selectFormState,
    (state: FormState) => state.patientIndex
);

export const selectDoctor = createSelector(
    selectFormState,
    (state: FormState) => state.doctorIndex
);

export const selectPatient = createSelector(
    selectFormState,
    (state: FormState) => state.patientIndex
);

export const selectDoctorAndPatient = createSelector(
    selectFormState,
    (state: FormState) => ({
        doctorIndex: state.doctorIndex,
        patientIndex: state.patientIndex,
    })
);
