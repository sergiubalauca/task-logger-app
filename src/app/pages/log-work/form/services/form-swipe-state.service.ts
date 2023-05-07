import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FormSwipeStateService {
    private currentDoctor: BehaviorSubject<{
        index: number;
    }> = new BehaviorSubject<{ index: number }>({ index: 0 });

    private currentPacient: BehaviorSubject<{
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

    public setCurrentPacient(index: number) {
        this.currentPacient.next({ index });
    }

    public getCurrentPacient() {
        return this.currentPacient.asObservable();
    }

    public resetCurrentPacient() {
        this.currentPacient.next({ index: 0 });
    }
}
