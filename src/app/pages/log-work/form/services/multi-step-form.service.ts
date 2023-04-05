import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class MultiStepFormService {
    private multiStepLogWorkForm: FormGroup;

    constructor() {}

    public initMultiStepForm() {
        if (this.multiStepLogWorkForm) {
            console.log('GSB return existing');
            return this.multiStepLogWorkForm;
        }

        this.multiStepLogWorkForm = new FormGroup({
            doctorGroup: new FormGroup({
                doctor: new FormArray([]),
                patientGroup: new FormGroup({
                    patient: new FormArray(
                        [
                            new FormControl(null, {
                                validators: [Validators.required],
                            }),
                        ],
                        {
                            validators: [Validators.required],
                        }
                    ),
                    workItemGroup: new FormGroup({
                        workItemAndNumber: new FormArray(
                            [
                                new FormGroup({
                                    workItem: new FormControl(null, {
                                        validators: [Validators.required],
                                    }),
                                    numberOfWorkItems: new FormControl(null, {
                                        validators: [Validators.required],
                                    }),
                                }),
                            ],
                            {
                                validators: [Validators.required],
                            }
                        ),
                    }),
                }),
            }),
            timeGroup: new FormGroup({
                startTime: new FormControl(null, {
                    validators: [Validators.required],
                }),
                endTime: new FormControl(null, {
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
        return (this.getDoctorFormGroup().controls.doctor as FormArray)
            .controls;
    }

    public createNewDoctorControl() {
        return new FormGroup({
            doctor: new FormControl(null, {
                validators: [Validators.required],
            }),
        });
    }
}
