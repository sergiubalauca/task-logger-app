import {
    AfterViewInit,
    Component,
    inject,
    OnInit,
    TrackByFunction,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { lazyArray } from 'src/app/shared/lazy-rendering.operator';
import { RandomUser, RandomUsers } from 'src/app/shared/models/random-user';

import { IonicModule, NavController } from '@ionic/angular';
import { TestComponent } from './test/test.component';
import { CommonModule } from '@angular/common';
import { Test2Component } from './test2/test2.component';
import { Test3Component } from './test3/test3.component';
import { UserService } from './services';
@Component({
    selector: 'app-home',
    templateUrl: 'playground.page.html',
    styleUrls: ['playground.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        TestComponent,
        CommonModule,
        Test2Component,
        Test3Component,
    ],
    providers: [UserService],
})
export class PlaygroundPage implements OnInit, AfterViewInit {
    // public users$: Observable<RandomUser[]> = of([]);
    public users$: Observable<RandomUser[]> = of([]);

    public data$: Observable<any>;
    public data2$: Observable<any>;
    public results = 20;
    public data: RandomUsers = {
        info: {
            results: 0,
            page: 0,
        },
        results: [],
    };

    public imageDestination: string;

    // private readonly url = 'https://randomuser.me/api/?results=${this.numberOfRecords}&page=1';
    private readonly url = `https://randomuser.me/api/?results=${this.results}&page=1`;
    private userService: UserService = inject(UserService);
    private navController: NavController = inject(NavController);

    constructor(private httpService: HttpClient) {}

    ngAfterViewInit() {}

    public loadChild(user: RandomUser) {
        this.navController.navigateForward('playground/test3-child');
    }
    public ngOnInit(): void {
        // this.data$ = this.httpService
        //     .get(this.url)
        //     .pipe(map((data: any) => data as RandomUser));
        // this.data2$ = this.httpService.get(this.url).pipe(
        //     map((data: any) => data.results),
        //     lazyArray(3000, 10),
        //     map((data: any) => data as RandomUser)
        // );
        this.users$ = this.userService.getUsers(1);
    }

    // public trackById(
    //     index,
    //     item: {
    //         id: {
    //             name: string;
    //             value: string;
    //         };
    //     }
    // ) {
    //     return item.id.value;
    // }

    public editUser(user: RandomUser) {}
    public deleteUser(user: RandomUser) {}
    public trackById: TrackByFunction<RandomUser> = (
        index,
        { id }: RandomUser
    ) => id.value;
}
