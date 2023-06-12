import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { lazyArray } from 'src/app/shared/lazy-rendering.operator';
import { RandomUser } from 'src/app/shared/models/random-user';

import { IonicModule } from '@ionic/angular';
import { TestComponent } from './test/test.component';
import { CommonModule } from '@angular/common';
import { Test2Component } from './test2/test2.component';
@Component({
    selector: 'app-home',
    templateUrl: 'playground.page.html',
    styleUrls: ['playground.page.scss'],
    standalone: true,
    imports: [IonicModule, TestComponent, CommonModule, Test2Component],
})
export class HomePage implements OnInit, AfterViewInit {
    public data$: Observable<any>;
    public data2$: Observable<any>;
    public results = 200;
    public data: RandomUser = {
        info: {
            results: 0,
            page: 0,
        },
        results: [],
    };

    public imageDestination: string;

    // private readonly url = 'https://randomuser.me/api/?results=${this.numberOfRecords}&page=1';
    private readonly url = `https://randomuser.me/api/?results=${this.results}&page=1`;

    constructor(private httpService: HttpClient) {}

    ngAfterViewInit() {}

    public ngOnInit(): void {
        this.data$ = this.httpService
            .get(this.url)
            .pipe(map((data: any) => data as RandomUser));
        this.data2$ = this.httpService.get(this.url).pipe(
            map((data: any) => data.results),
            lazyArray(3000, 10),
            map((data: any) => data as RandomUser)
        );
    }

    public trackById(
        index,
        item: {
            id: {
                name: string;
                value: string;
            };
        }
    ) {
        return item.id.value;
    }
}
