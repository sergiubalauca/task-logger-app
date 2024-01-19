import {
    FormArray,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';

export enum OperatorMessage {
    greaterThan = 'greater than',
    lessThan = 'less than',
    greaterThanOrEqualTo = 'greater than or equal to',
    lessThanOrEqualTo = 'less than or equal to',
}

type Operator = keyof typeof OperatorMessage;

export const dateCompareAgainstValidator = (
    compareControlName: string,
    operator: Operator
): ValidatorFn => {
    return (formControl: FormGroup): ValidationErrors | null => {
        const parent = formControl.parent as FormGroup;
        const compareControl = parent?.controls[compareControlName] ?? null;
        const formControlValue = formControl.value; // '11:22' format
        const compareControlValue = compareControl?.value ?? null; // '11:23' format

        if (!compareControl || !formControlValue || !compareControlValue) {
            return null;
        }

        const controlHours = formControlValue?.split(':')[0];
        const controlMinutes = formControlValue?.split(':')[1];

        const compareControlHours = compareControlValue?.split(':')[0];
        const compareControlMinutes = compareControlValue?.split(':')[1];

        const controlDate = new Date();
        controlDate.setHours(controlHours);
        controlDate.setMinutes(controlMinutes);

        const compareControlDate = new Date();
        compareControlDate.setHours(compareControlHours);
        compareControlDate.setMinutes(compareControlMinutes);

        const { controlDateTime, compareControlDateTime } = {
            controlDateTime: controlDate.getTime(),
            compareControlDateTime: compareControlDate.getTime(),
        };

        cleanControlValidations(parent, compareControlName, ['dateComparison']);

        switch (operator) {
            case 'lessThan':
                if (controlDateTime < compareControlDateTime) {
                    formControl.setErrors(null);
                    return null;
                }
                return {
                    dateComparison: true,
                };
            case 'greaterThan':
                if (controlDateTime > compareControlDateTime) {
                    formControl.setErrors(null);
                    return null;
                }
                return {
                    dateComparison: true,
                };
            default:
                break;
        }

        return null;
    };
};

export const cleanControlValidations = (
    form: FormGroup | FormArray,
    controlKey: string,
    validations: Array<string>
): void => {
    validations.forEach((validation: string) => {
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
