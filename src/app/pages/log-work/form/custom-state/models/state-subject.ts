import { isEqual } from 'lodash';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';

export class StateSubject<T> extends BehaviorSubject<T> {
    private initialValue: T;

    constructor(value: T) {
        super(value);
        this.initialValue = value;
    }

    get value$(): Observable<T> {
        return super
            .asObservable()
            .pipe(distinctUntilChanged((a, b) => isEqual(a, b)));
    }

    update(value: T): void {
        this.next(value);
    }

    reset(): void {
        this.next(this.initialValue);
    }
}
