/* eslint-disable @typescript-eslint/member-ordering */
import { Observable, Subject } from 'rxjs';

export abstract class SyncBaseService {
    protected doneSubject: Subject<boolean> = new Subject<boolean>();
    public done$: Observable<boolean> = this.doneSubject.asObservable();
    public abstract startSyncing(): Promise<void>;
}
