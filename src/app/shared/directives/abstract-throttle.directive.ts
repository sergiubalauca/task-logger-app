import { Directive, OnDestroy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, throttleTime, tap } from 'rxjs/operators';

@Directive(
	{
		standalone: true,
	}
)
export abstract class AbstractThrottleDirective implements OnDestroy, OnInit {
	@Input()
	public throttleTime: number;

	@Output()
	public eventTriggered: EventEmitter<any>;

	protected emitEvent$: Subject<any>;
	protected subscription$: Subject<void>;

	public constructor() {
		this.throttleTime = 5000;
		this.eventTriggered = new EventEmitter<any>();
		this.emitEvent$ = new Subject<any>();
		this.subscription$ = new Subject<void>();
	}

	public ngOnInit(): void {
		this.emitEvent$
			.pipe(
				takeUntil(this.subscription$),
				throttleTime(this.throttleTime),
				tap((value) => {
					this.emitChange(value);
					console.log('GSB AbstractThrottleDirective emitEvent$ value: ', value);
				})
			)
			.subscribe();
	}

	public emitChange(value: any): void {
		this.eventTriggered.emit(value);
	}

	public ngOnDestroy(): void {
		this.subscription$.next();
		this.subscription$.complete();
	}
}
