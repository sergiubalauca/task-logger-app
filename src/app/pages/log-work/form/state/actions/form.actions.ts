import { createAction } from '@ngrx/store';

export const removePatientControl = createAction(
    '[MultiStepForm] Remove Patient Control',
    (doctorIndex: number, patientIndex: number) => ({
        doctorIndex,
        patientIndex,
    })
);

export const addPatientControl = createAction(
    '[MultiStepForm] Add Patient Control',
    (doctorIndex: number) => ({ doctorIndex })
);

export const addDoctorControl = createAction(
    '[MultiStepForm] Add Doctor Control'
);

export const removeDoctorControl = createAction(
    '[MultiStepForm] Remove Doctor Control',
    (doctorIndex: number) => ({ doctorIndex })
);

export const onDoctorSelected = createAction(
    '[MultiStepForm] On Doctor Selected',
    (doctorIndex: number) => ({ doctorIndex })
);

export const onGoToDoctor = createAction(
    '[MultiStepForm] On Go To Doctor',
    (doctorIndex: number) => ({ doctorIndex })
);

export const onGoToPatient = createAction(
    '[MultiStepForm] On Go To Patient',
    (doctorIndex: number, patientIndex: number) => ({
        doctorIndex,
        patientIndex,
    })
);
