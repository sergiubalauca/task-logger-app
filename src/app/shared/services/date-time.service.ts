import { Injectable } from '@angular/core';

@Injectable()
export class DateTimeService {
	// todo: use this in all places where we want current date
	public getCurrentDateTime(): Date {
		return new Date();
	}
}
