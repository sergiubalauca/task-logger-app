import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    map,
    mergeMap,
    Observable,
    of,
    shareReplay,
} from 'rxjs';
import { RandomUser } from 'src/app/shared/models/random-user';

@Injectable()
export class UserService {
    // public users$: Observable<RandomUser[]> = new Observable<RandomUser[]>();
    public users$: Observable<RandomUser[]> = of([]);
    private readonly url: string = '';
    private readonly results = 20;
    private updatedUser$: BehaviorSubject<RandomUser> =
        new BehaviorSubject<null>(null);

    constructor(private readonly httpService: HttpClient) {
        this.url = `https://randomuser.me/api/?results=${this.results}&page=1`;
    }

    public getUser(id: string): Observable<RandomUser> {
        return this.httpService.get(this.url).pipe(
            map((data: any) => data.results),
            map((users: RandomUser[]) =>
                users.find((user: RandomUser) => user.id.value === id)
            ),
            shareReplay(1)
        );
    }

    public getUsers(page: number): Observable<RandomUser[]> {
        // if (!this.users$[page]) {
        this.users$ = this.httpService.get(this.url).pipe(
            map((data: any) => data.results),
            shareReplay(1)
        ) as Observable<RandomUser[]>;
        // }

        return this.users$;
    }

    public updateUser(user: RandomUser, page: number): void {
        // this.updatedUser$.pipe(mergeMap((updatedUser: RandomUser) => of(user)));

        this.users$.subscribe((users: RandomUser[]) => {
            console.log(users);
        });
        this.users$ = this.users$.pipe(
            mergeMap((users: RandomUser[]) => {
                const index = users.findIndex(
                    (u: RandomUser) => u.id.value === user.id.value
                );
                users[index] = user;

                return of(users);
            })
        );
    }
}
