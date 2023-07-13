import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateTimeService {
    public getCurrentDateTime(): Date {
        return new Date();
    }

    public getDailyWorkId(date: Date): string {
        if (!date) {
            return null;
        }
        return date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear();
    }
}
