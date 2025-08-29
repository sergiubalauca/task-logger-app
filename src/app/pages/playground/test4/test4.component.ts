import { CommonModule } from '@angular/common';
import {
    booleanAttribute,
    ChangeDetectionStrategy,
    Component,
    input,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-test4',
    templateUrl: './test4.component.html',
    styleUrls: ['./test4.component.scss'],
    imports: [CommonModule, IonicModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test4Component {
    public count = input<number | undefined>();
    public count2 = input.required<number>();
    public flag = input<string | boolean, boolean>(false, {
        // gsb: this signature says type string | boolean and then boolean as the type expected after transformation
        transform: booleanAttribute,
        alias: 'flag',
    });
    public flag2 = input<string | boolean>();
}
