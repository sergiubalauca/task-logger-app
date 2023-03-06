import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { RandomUser } from 'src/app/shared/models/random-user';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test2Component implements OnInit {
  @Input() data: Observable<any>;
  constructor() {}

  ngOnInit() {
    console.log(this.data);
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
