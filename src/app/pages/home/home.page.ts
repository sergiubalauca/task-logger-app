import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { lazyArray } from 'src/app/shared/lazy-rendering.operator';
import { RandomUser } from 'src/app/shared/models/random-user';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public data$: Observable<any>;
  public data2$: Observable<any>;
  public results = 20;
  public data: RandomUser = {
    info: {
      results: 0,
      page: 0,
    },
    results: [],
  };

  // private readonly url = 'https://randomuser.me/api/?results=${this.numberOfRecords}&page=1';
  private readonly url = `https://randomuser.me/api/?results=${this.results}&page=1`;

  constructor(private httpService: HttpClient) {}

  public ngOnInit(): void {
    this.data$ = this.httpService
      .get(this.url)
      .pipe(map((data: any) => data as RandomUser));
    this.data2$ = this.httpService.get(this.url).pipe(
      map((data: any) => data.results),
      lazyArray(200, 10),
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
