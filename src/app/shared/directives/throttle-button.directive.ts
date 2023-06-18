import { Directive, HostListener } from '@angular/core';
import { AbstractThrottleDirective } from './abstract-throttle.directive';

@Directive({
	selector: '[appThrottleButtonDirective]',
	standalone: true,
})
export class ThrottleButtonDirective extends AbstractThrottleDirective {
	public constructor() {
		super();
	}

	@HostListener('click', ['$event'])
	public clickEvent(event: any): void {
		event.preventDefault();
		event.stopPropagation();
		this.emitEvent$.next(event);
	}
}
