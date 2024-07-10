import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    TrackByFunction,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    delay,
    map,
    mergeMap,
    scan,
    shareReplay,
    startWith,
    switchMap,
    take,
    withLatestFrom,
} from 'rxjs/operators';
import { interval, Observable, of } from 'rxjs';
import { lazyArray } from 'src/app/shared/lazy-rendering.operator';
import { RandomUser, RandomUsers } from 'src/app/shared/models/random-user';

import { IonicModule, NavController } from '@ionic/angular';
import { TestComponent } from './test/test.component';
import { CommonModule } from '@angular/common';
import { Test2Component } from './test2/test2.component';
import { Test3Component } from './test3/test3.component';
import { UserService } from './services';
import { ActivatedRoute, Router } from '@angular/router';
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
    // providers: [UserService],
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

    constructor(
        private httpService: HttpClient,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) {
        setInterval(() => {
            this.cdr.detectChanges();
        }, 1000);
    }

    ngAfterViewInit() {}

    public loadChild(user: RandomUser) {
        this.navController.navigateForward(
            `playground/test3-child?id=${user.email}`
        );

        // this.router.navigate(['./test3-child'], {
        //     relativeTo: this.route,
        //     queryParams: { id: user.email },
        // });
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

    public addOne() {
        this.userService.addUser();
    }

    public editUser(user: RandomUser) {}
    public deleteUser(user: RandomUser) {}
    public trackById: TrackByFunction<RandomUser> = (
        index,
        { id }: RandomUser
    ) => id.value;
}

const greatestNumberOfRepeatedCharacters = (s: string): string => {
    const separateCharacters = s.split(' ');
    const maxWordMap = new Map<string, number>();

    separateCharacters.forEach((word) => {
        const wordMap = new Map<string, number>();
        const characters = word.split('');

        characters.forEach((char) => {
            if (wordMap.has(char)) {
                wordMap.set(char, wordMap.get(char) + 1);
            } else {
                wordMap.set(char, 1);
            }
        });

        const maxChar = Array.from(wordMap.entries()).reduce((a, b) =>
            a[1] > b[1] ? a : b
        );
        maxWordMap.set(word, maxChar[1]);
    });

    return Array.from(maxWordMap.entries()).reduce((a, b) =>
        a[1] > b[1] ? a : b
    )[0];
};

const smallestDifferenceBetweenDates = (strArr: string[]) => {
    // str = ['1:10pm', '4:40am', '5:00pm']
    const dates = strArr.map((date) => {
        const [time, ampm] = date.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        return {
            hours: hours + (ampm === 'pm' ? 12 : 0),
            minutes,
        };
    });

    for (let i = 0; i < dates.length; i++) {
        for (let j = i + 1; j < dates.length; j++) {
            const date: Date = new Date();
            date.setHours(dates[i].hours);
            date.setMinutes(dates[i].minutes);

            const nextDate: Date = new Date();
            nextDate.setHours(dates[j].hours);
            nextDate.setMinutes(dates[j].minutes);

            const difference = Math.abs(date.getTime() - nextDate.getTime());

            if (i === 0 && j === 1) {
                var minDiff = difference;
            } else {
                minDiff = Math.min(minDiff, difference);
            }
        }
    }

    return minDiff;
};

// ===========
// function StringChallenge(strArr) {
//     const mappedDates = strArr.map((date) => {
//       const indexOfA = date.indexOf('a');
//       const indexOfP = date.indexOf('p');

//       const idx = indexOfA > indexOfP ? indexOfA : indexOfP;

//       const { hm, merid } = { hm: date.substring(0, idx), merid: date.substring(idx) };
//       const [hour, min] = hm.split(':');
//       let meridHour = hour;

//       // console.log('GSB merid === "pm": ', merid === "pm")
//       // console.log('GSB merid === "am": ', merid === "am")
//       // console.log('GSB hour === 12: ', hour === '12')

//       // console.log('GSB hour, min, merid: ', hour, min, merid)
//       // ===================================
//       if (merid === "pm" && hour !== '12') {
//         meridHour = Number(meridHour) + 12;
//       }
//       if (merid === "am" && hour === '12') {
//         meridHour = 0
//       }
//       // ===================================

//     // console.log('GSB meridHour: ', meridHour);

//       // const meridHour = merid === 'pm' ? 12 : 0; // add extra 12 hours if post merid
//       const parseHours = Number(meridHour);

//       return {
//         hours: parseHours,
//         min
//       }
//     });

//     let smallestDiff;

//     // one loop is not enough, I need to re iterate each element over the entire list, not sequentially 2 at a time
//     for (let i = 0; i < mappedDates.length; i++) {
//       for (let j = i + 1; j < mappedDates.length; j++) {
//         const date = new Date();
//         const nextDate = new Date();

//         date.setHours(mappedDates[i].hours);
//         date.setMinutes(mappedDates[i].min);

//         // based on failing test case ["10:00am", "11:45pm", "5:00am", "12:01am"],
//         // I adapted the logic for when the hour is 0, to increment the day.
//         // I still feel it'a a bit odd, since there was no such specification.
//         // I initially assumed that all hours are within the same day.
//         if (mappedDates[i].hours === 0) {
//           date.setDate(date.getDate() + 1);
//         }

//         nextDate.setHours(mappedDates[j].hours);
//         nextDate.setMinutes(mappedDates[j].min);
//         if (mappedDates[j].hours === 0) {
//           nextDate.setDate(nextDate.getDate() + 1);
//         }

//         const diff = Math.abs(date.getTime() - nextDate.getTime());

//         // initialize smallestDiff on first iteration
//         if (i === 0 && j === 1) smallestDiff = diff;

//         smallestDiff = Math.min(smallestDiff, diff);
//       }
//     }

//     const smallestDiffInMinutes = smallestDiff / 60000;
//     return smallestDiffInMinutes;

//   }

//   // keep this function call here
//   console.log(StringChallenge(readline()));
