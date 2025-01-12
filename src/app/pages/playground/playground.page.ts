import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    signal,
    untracked,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'playground.page.html',
    styleUrls: ['playground.page.scss'],
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundPage implements OnInit {
    mySubject = new BehaviorSubject(0);
    mySignal = signal(0);
    myObservable = toObservable(this.mySignal);

    private myMultiplicator = signal(2);
    protected myNumber = signal(5);
    products = signal([]);
    favoriteFood = inject(FormBuilder).group({
        category: [''],
        products: [''],
    });
    categoryChange = toSignal(this.favoriteFood.get('category')!.valueChanges, {
        initialValue: '',
    });
    counterOne = signal(1);
    protected counter = signal(0);
    counterTwo = signal(2);
    summarizedCount = computed(
        // () => this.counterOne() + untracked(() => this.counterTwo())
        () => this.counterOne() + untracked(this.counterTwo)
    );

    private effRef = effect(() => {
        console.log('Effect 2 runs with: ', this.counter());
    });

    incrementOne() {
        this.counterOne.update((v) => v + 1);
    }
    incrementTwo() {
        this.counterTwo.update((v) => v + 1);
    }

    updateSubjectValue() {
        this.mySubject.next(this.mySubject.value + 1);
        this.mySubject.next(this.mySubject.value + 1);
        this.mySubject.next(this.mySubject.value + 1);
    }
    updateSignalValue() {
        this.mySignal.update((v) => v + 1);
        this.mySignal.update((v) => v + 1);
        this.mySignal.update((v) => v + 1);
    }

    constructor() {
        this.mySubject.subscribe((e) =>
            console.log(`Subject emits new value: ${e}`)
        );
        this.myObservable.subscribe((e) =>
            console.log(`MyObservable emits new value: ${e}`)
        );

        const counter = signal(0);

        effect(() => {
            console.log('Effect runs with: ', counter());
        });

        counter.set(1);
        counter.set(2);
        counter.update((current) => current + 1);
        counter.update((current) => current + 1);
        // effect(() => {
        //     console.log(
        //         `Sum: ${this.counterOne() + untracked(() => this.counterTwo())}`
        //     );
        // });

        // effect(() => {
        //     this.myNumber.set(this.myMultiplicator() * 2);
        // });

        // effect(() => {
        //     console.log(`Result: ${this.myMultiplicator() * this.myNumber()}`);
        // });

        effect((onCleanup) => {
            const id = setInterval(() => {
                console.log(`${this.myNumber()} delivered`);
            }, 1000);

            onCleanup(() => {
                clearInterval(id);
            });
        });
        // effect(
        //     () => {
        //         if (this.categoryChange() === 'Food') {
        //             this.products.set(['FOODS']);
        //         }
        //         if (this.categoryChange() === 'Beverage') {
        //             this.products.set(['DRINKS']);
        //         }
        //     },
        //     { allowSignalWrites: true }
        // );
    }
    protected stringSignal = signal('string');
    private effectRef = effect(() => {
        72;
        console.log('Something');
    }, {});
    private readSig = this.stringSignal();

    public ngOnInit(): void {
        this.counter.set(1);
        this.counter.set(2);
        this.counter.update((current) => current + 1);
        this.counter.update((current) => current + 1);
    }

    protected updateSignal(val: string): void {
        // this.stringSignal.update((v) => v + val);
        this.stringSignal.set(val);
    }

    private stopEffect(): void {
        this.effectRef?.destroy();
    }
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
