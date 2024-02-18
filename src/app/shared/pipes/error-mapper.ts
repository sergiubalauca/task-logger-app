import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export enum ErrorMapper {
    required = 'Field is required',
    startTimeAfterEndTime = 'Start time must be before end time',
    endTimeBeforeStartTime = 'End time must be after start time',
    min = 'Value is too small',
    dateComparison = 'Check start/end time',
    overlappingBreaks = 'Breaks cannot overlap',
}

export type ErrorMapperKeys = keyof typeof ErrorMapper;

@Pipe({
    standalone: true,
    name: 'translateError',
})
export class TranslateErrorPipe implements PipeTransform {
    public transform(error: ValidationErrors): string[] {
        if (!error) {
            return [];
        }
        const errorMessages: string[] = [];

        Object.keys(error).forEach((key) => {
            error[key] = ErrorMapper[key];
            errorMessages.push(error[key]);
        });
        console.log(errorMessages);
        return errorMessages;
    }
}
