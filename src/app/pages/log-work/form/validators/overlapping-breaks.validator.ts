import {
    AbstractControl,
    FormArray,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import { cleanControlValidations } from './clean-validators';

export const overlappingBreaksValidator = (
    compareControlName: string
): ValidatorFn | null => {
    return (control: AbstractControl): ValidationErrors | null => {
        const group = control.parent;
        const parentGroup = group?.parent as FormArray;

        if (!group) {
            return null;
        }

        const breakStart = group.get('startTime')?.value;
        const breakEnd = group.get('endTime')?.value;

        const breaks = [];
        const controlValue = control.value;

        if (!group || !controlValue || !parentGroup) {
            return null;
        }

        // find current control in parentGroup array using findIndex
        const controlIndex = parentGroup.controls.findIndex(
            (controlItem) => controlItem === group
        );

        // exclude current control from breaks array
        parentGroup.controls.forEach((controlItem, index) => {
            if (index !== controlIndex) {
                breaks.push({
                    startTime: controlItem.get('startTime')?.value,
                    endTime: controlItem.get('endTime')?.value,
                });
            }
        });

        cleanControlValidations(parentGroup, compareControlName, [
            'overlappingBreaks',
        ]);
        // overlapping before
        const overlappingBefore = breaks.find(
            (breakItem) =>
                breakItem.endTime > breakStart &&
                breakItem.startTime < breakStart
        );

        // overlapping after
        const overlappingAfter = breaks.find(
            (breakItem) =>
                breakItem.startTime < breakEnd && breakItem.endTime > breakEnd
        );

        // overlapping wrap
        const overlappingWrap = breaks.find(
            (breakItem) =>
                breakItem.startTime < breakStart && breakItem.endTime > breakEnd
        );

        // overlapping inner before
        const overlappingInnerBefore = breaks.find(
            (breakItem) =>
                breakItem.startTime < breakStart &&
                breakItem.endTime > breakStart
        );

        // overlapping inner after
        const overlappingInnerAfter = breaks.find(
            (breakItem) =>
                breakItem.startTime < breakEnd && breakItem.endTime > breakEnd
        );

        if (
            overlappingBefore ||
            overlappingAfter ||
            overlappingWrap ||
            overlappingInnerBefore ||
            overlappingInnerAfter
        ) {
            return {
                overlappingBreaks: true,
            };
        }
    };
};
