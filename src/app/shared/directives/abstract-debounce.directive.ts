import { Directive, OnDestroy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Directive()
export abstract class AbstractDebounceDirective implements OnDestroy, OnInit {
	@Input()
	public debounceTime: number;

	@Output()
	public eventTriggered: EventEmitter<any>;

	protected emitEvent$: Subject<any>;
	protected subscription$: Subject<void>;

	public constructor() {
		this.debounceTime = 500;
		this.eventTriggered = new EventEmitter<any>();
		this.emitEvent$ = new Subject<any>();
		this.subscription$ = new Subject<void>();
	}

	public ngOnInit(): void {
		this.emitEvent$
			.pipe(
				takeUntil(this.subscription$),
				debounceTime(this.debounceTime),
				distinctUntilChanged(),
				tap((value) => this.emitChange(value))
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
