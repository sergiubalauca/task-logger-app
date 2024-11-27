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
import { IonicModule, NavController } from '@ionic/angular';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { RandomUser } from 'src/app/shared/models/random-user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../services';

@Component({
    selector: 'app-test3-child',
    templateUrl: './test3-child.component.html',
    styleUrls: ['./test3-child.component.scss'],
    imports: [CommonModule, IonicModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Test3ChildComponent implements OnInit {
    public user$: Observable<RandomUser> = this.activatedRoute.data.pipe(
        takeUntilDestroyed(),
        map((data) => {
            const x = 1;
            return data.user as RandomUser;
        })
    );

    @Output() public editUserEvent: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();

    @Output() public deleteUser: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();

    // private destroyRef = inject(DestroyRef);

    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private navController: NavController
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

    public async editUser(user: RandomUser): Promise<void> {
        const userEdit: RandomUser = {
            ...user,
            name: {
                last: 'edited',
                first: 'edited',
                title: 'edited',
            },
        };
        this.userService.updateUser(userEdit, 1);

        await this.navController.navigateBack('playground');
    }
}
