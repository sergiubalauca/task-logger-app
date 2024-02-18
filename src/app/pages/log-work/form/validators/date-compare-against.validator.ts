import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { cleanControlValidations } from './clean-validators';

export enum OperatorMessage {
    greaterThan = 'greater than',
    lessThan = 'less than',
    greaterThanOrEqualTo = 'greater than or equal to',
    lessThanOrEqualTo = 'less than or equal to',
}

type Operator = keyof typeof OperatorMessage;

export const dateCompareAgainstValidator = (
    compareControlName: string,
    operator: Operator,
    isBreakAgainstTimeCheck = false
): ValidatorFn => {
    return (formControl: FormGroup): ValidationErrors | null => {
        const parent = isBreakAgainstTimeCheck
            ? (formControl?.root?.get('timeGroup') as FormGroup)
            : (formControl.parent as FormGroup);

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
            case 'greaterThanOrEqualTo':
                if (controlDateTime >= compareControlDateTime) {
                    formControl.setErrors(null);
                    return null;
                }
                return {
                    dateComparison: true,
                };
            case 'lessThanOrEqualTo':
                if (controlDateTime <= compareControlDateTime) {
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
