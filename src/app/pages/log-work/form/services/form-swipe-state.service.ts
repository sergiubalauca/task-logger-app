import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FormSwipeStateService {
    private currentDoctor: BehaviorSubject<{
        index: number;
    }> = new BehaviorSubject<{ index: number }>({ index: 0 });

    constructor() {}

    public setCurrentDoctor(index: number) {
        this.currentDoctor.next({ index });
    }

    public getCurrentDoctor() {
        return this.currentDoctor.asObservable();
    }

    public resetCurrentDoctor() {
        this.currentDoctor.next({ index: 0 });
    }
}
