import { FormArray, FormGroup } from '@angular/forms';

export const cleanControlValidations = (
    form: FormGroup | FormArray,
    controlKey: string,
    validations: Array<string>
): void => {
    validations.forEach((validation: string) => {
        if (form instanceof FormArray) {
            form.controls.forEach((control) => {
                if (control instanceof FormGroup) {
                    cleanControlValidations(control, controlKey, validations);
                }
            });
        }
        const control = form?.get(controlKey);

        if (control?.hasError(validation)) {
            control.setErrors(null);
            const errors = control.errors;
            if (errors) {
                delete errors[validation];
            }
            control.updateValueAndValidity();
        }
    });
};
