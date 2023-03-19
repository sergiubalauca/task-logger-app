import { Directive, HostListener } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';

@Directive({
	selector: 'ion-input[appDebounceKeyUpDirective]'
})
export class DebounceKeyupDirective extends AbstractDebounceDirective {
	public constructor() {
		super();
	}

	@HostListener('keyup', ['$event'])
	public onKeyUp(event: any): void {
		event.preventDefault();
		this.emitEvent$.next(event);
	}
}
