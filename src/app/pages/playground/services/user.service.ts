import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    map,
    mergeMap,
    Observable,
    of,
    scan,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { RandomUser } from 'src/app/shared/models/random-user';

@Injectable()
export class UserService {
    public users$: Observable<RandomUser[]> = of([]);
    private readonly url: string = '';
    private readonly results = 2;
    private busers$: Subject<RandomUser> = new Subject<null>();

    constructor(private readonly httpService: HttpClient) {
        console.log('UserService constructor');
        this.url = `https://randomuser.me/api/?results=${this.results}&page=1`;
    }

    public getUser(id: string): Observable<RandomUser> {
        return this.users$.pipe(
            map((users: RandomUser[]) =>
                users.find((user: RandomUser) => {
                    const x = 1;
                    return user.email === id;
                })
            )
        );

        // return this.users$.pipe(
        //     switchMap((initialState: RandomUser[]) => {
        //         console.log('initialState', initialState);
        //         return this.getStateUser().pipe(
        //             startWith(initialState),
        //             scan((acc: RandomUser[], curr: RandomUser) => {
        //                 console.log('acc', acc);
        //                 console.log('curr', curr);

        //                 const index = acc.findIndex(
        //                     (user: RandomUser) => user.email === curr.email
        //                 );
        //                 if (index > -1) {
        //                     acc[index] = curr;
        //                     return acc;
        //                 }

        //                 return [...acc, curr];
        //             }),
        //             map((data: RandomUser[]) => {
        //                 console.log('data', data);
        //                 return data[0];
        //             })
        //         );
        //     })
        // );
    }

    public getStateUser() {
        return this.busers$.asObservable();
    }

    public getUsers(page: number): Observable<RandomUser[]> {
        this.users$ = this.httpService.get(this.url).pipe(
            map((data: any) => data.results),
            switchMap((initialState: RandomUser[]) => {
                const x = 1;
                // console.log('initialState', initialState);
                return this.getStateUser().pipe(
                    startWith(initialState),
                    scan((acc: RandomUser[], curr: RandomUser) => {
                        // console.log('acc', acc);
                        // console.log('curr', curr);

                        const index = acc.findIndex(
                            (user: RandomUser) => user.email === curr.email
                        );
                        if (index > -1) {
                            acc[index] = curr;
                            return acc;
                        }

                        return [...acc, curr];
                    }),
                    map((data: RandomUser[]) => {
                        const y = 1;
                        // console.log('data', data);
                        return data;
                    })
                );
            }),
            shareReplay(1)
        );

        return this.users$;
    }

    public addUser(): void {
        this.busers$.next({
            id: {
                name: 'GSB',
                value: 'GSB',
            },
            name: {
                title: 'Mr',
                first: 'John',
                last: 'Doe',
            },
            email: 'gsb@gsb.com',
            picture: {
                medium: 'https://randomuser.me/api/portraits/med/men/69.jpg',
            },
        });
    }

    public updateUser(user: RandomUser, page: number): void {
        this.busers$.next(user);
    }
}
