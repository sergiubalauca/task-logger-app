import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateTimeService {
    public getCurrentDateTime(): Date {
        return new Date();
    }

    public isLeapYear(): boolean {
        const currentYear = this.getCurrentDateTime().getFullYear();
        return (
            (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
            currentYear % 400 === 0
        );
    }

    public getDailyWorkId(date: Date): string {
        if (!date) {
            return null;
        }
        return (
            date.getDate() +
            '-' +
            (date.getMonth() + 1) +
            '-' +
            date.getFullYear()
        );
    }
}
