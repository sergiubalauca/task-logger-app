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
                patientGroup: this.fb.group({
                    patient: this.fb.array([], {
                        validators: [Validators.required],
                    }),
                    workItemGroup: this.fb.group({
                        workItemAndNumber: this.fb.array(
                            [
                                this.fb.group({
                                    workItem: this.fb.control(null, {
                                        validators: [Validators.required],
                                    }),
                                    numberOfWorkItems: this.fb.control(null, {
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

    newDoctor = () =>
        this.fb.group({
            doctor: '',
        });
}
