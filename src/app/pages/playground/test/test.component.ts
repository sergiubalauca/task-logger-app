import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
    imports: [IonicModule]
})
export class TestComponent implements OnInit {
  @ViewChild('itemsContainer', { read: ViewContainerRef })
  public container: ViewContainerRef;
  @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

  @Input() data: any;
  constructor() {}

  ngOnInit() {
    this.buildData(this.data.info.results);
  }

  private buildData(length: number) {
    const ITEMS_RENDERED_AT_ONCE = 20;
    const INTERVAL_IN_MS = 5000;
    let item: {
      id: {
        name: string;
        value: string;
      };
      email: string;
      name: {
        title: string;
        first: string;
        last: string;
      };
      picture: {
        medium: string;
      };
    } = {
      id: {
        name: '',
        value: '',
      },
      email: '',
      name: {
        title: '',
        first: '',
        last: '',
      },
      picture: {
        medium: '',
      },
    };
    let currentIndex = 0;

    const interval = setInterval(() => {
      const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;

      for (let n = currentIndex; n < nextIndex; n++) {
        if (n >= length) {
          clearInterval(interval);
          break;
        }
        item = {
          id: {
            name: this.data.results[n].id.name,
            value: this.data.results[n].id.value,
          },
          email: this.data.results[n].email,
          name: {
            title: this.data.results[n].name.title,
            first: this.data.results[n].name.first,
            last: this.data.results[n].name.last,
          },
          picture: {
            medium: this.data.results[n].picture.medium,
          },
        };
        const context = {
          item,
        };
        this.container.createEmbeddedView(this.template, context);
      }

      currentIndex += ITEMS_RENDERED_AT_ONCE;
    }, INTERVAL_IN_MS);
  }
}
