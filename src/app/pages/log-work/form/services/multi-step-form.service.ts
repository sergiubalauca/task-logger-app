import { Injectable } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';

@Injectable()
export class MultiStepFormService {
    private multiStepLogWorkForm: FormGroup;

    constructor(private fb: FormBuilder) {}

    public initMultiStepForm() {
        if (this.multiStepLogWorkForm) {
            return this.multiStepLogWorkForm;
        }

        this.multiStepLogWorkForm = this.fb.group({
            doctorGroup: this.fb.group({
                doctorArray: this.fb.array([]),
            }),
            timeGroup: this.fb.group({
                startTime: this.fb.control(null, {
                    validators: [Validators.required],
                }),
                endTime: this.fb.control(null, {
                    validators: [Validators.required],
                }),
            }),
        });

        return this.multiStepLogWorkForm;
    }

    public getDoctorFormGroup() {
        return this.multiStepLogWorkForm.get('doctorGroup') as FormGroup;
    }

    public getDoctorFormGroupControls() {
        return (this.getDoctorFormGroup().controls.doctorArray as FormArray)
            .controls;
    }

    public getdoctorArray() {
        return this.getDoctorFormGroup().get('doctorArray') as FormArray;
    }

    public addDoctorControl() {
        return this.getdoctorArray().push(this.newDoctor());
    }

    public removeDoctorControl(index: number) {
        return this.getDoctorFormGroupControls().splice(index, 1);
    }

    public newDoctor = () =>
        this.fb.group({
            doctor: this.fb.control(null, {
                validators: [Validators.required],
            }),
            patientGroup: this.fb.group({
                patientArray: this.fb.array(
                    [
                        this.fb.group({
                            patient: this.fb.control(null, {
                                validators: [Validators.required],
                            }),
                            workItemGroup: this.fb.group({
                                workItemAndNumber: this.fb.array(
                                    [
                                        this.fb.group({
                                            workItem: this.fb.control(null, {
                                                validators: [
                                                    Validators.required,
                                                ],
                                            }),
                                            numberOfWorkItems: this.fb.control(
                                                null,
                                                {
                                                    validators: [
                                                        Validators.required,
                                                    ],
                                                }
                                            ),
                                        }),
                                    ],
                                    {
                                        validators: [Validators.required],
                                    }
                                ),
                            }),
                        }),
                    ],
                    {
                        validators: [Validators.required],
                    }
                ),
            }),
        });

    public getTimeFormGroup() {
        return this.multiStepLogWorkForm.get('timeGroup') as FormGroup;
    }

    public getPatientGroupFormGroup(doctorIndex?: number) {
        const doctorArray = this.getDoctorFormGroup().controls
            .doctorArray as FormArray;
        const doctorFormGroup = doctorArray.controls[doctorIndex] as FormGroup;
        return doctorFormGroup.controls.patientGroup as FormGroup;
    }

    public getPatientControls(index?: number) {
        const patientControls = (
            this.getPatientGroupFormGroup(index).controls
                .patientArray as FormArray
        ).controls;
        return patientControls;
    }

    public getPatientArray(index: number) {
        const x = this.getPatientGroupFormGroup(index).get(
            'patientArray'
        ) as FormArray;
        // const x = this.getPatientControls(index);
        return x;
    }

    public addPatientControl(index: number) {
        return this.getPatientArray(index).push(this.newPatient());
    }

    public removePatientControl(doctorIndex: number, pacientIndex: number) {
        return this.getPatientArray(doctorIndex).controls.splice(
            pacientIndex,
            1
        );
    }

    public newPatient = () =>
        this.fb.group({
            patient: '',
        });
}
