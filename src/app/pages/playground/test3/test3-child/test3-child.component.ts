import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { RandomUser } from 'src/app/shared/models/random-user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../services';

@Component({
    selector: 'app-test3-child',
    templateUrl: './test3-child.component.html',
    styleUrls: ['./test3-child.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test3ChildComponent implements OnInit {
    public user$: Observable<RandomUser> = this.activatedRoute.data.pipe(
        takeUntilDestroyed(),
        map((data) => data.user as RandomUser)
    );

    @Output() public editUserEvent: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();

    @Output() public deleteUser: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();

    // private destroyRef = inject(DestroyRef);

    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit() {
        const destroyed = new Subject();
        // this.destroyRef.onDestroy(() => {
        //     destroyed.next('destroyed');
        //     destroyed.complete();
        // });

        // this.user$ = this.activatedRoute.data.pipe(
        //     // takeUntil(destroyed),
        //     takeUntilDestroyed(),
        //     map((data) => data.user as RandomUser)
        // );
    }

    public editUser(user: RandomUser): void {
        const userEdit: RandomUser = {
            name: {
                first: 'John',
                last: 'Doe',
                title: 'Mr',
            },
            email: 'trst',
            id: {
                value: user.id.value,
                name: user.id.name,
            },
        };

        this.userService.updateUser(userEdit, 1);
    }
}
