import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThrottleButtonDirective } from '../../directives';
import { ItemSlidingProps } from './item-sliding-props.interface';

@Component({
    selector: 'app-item-sliding-card',
    templateUrl: './item-sliding-card.component.html',
    styleUrls: ['./item-sliding-card.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, IonicModule, ThrottleButtonDirective],
})
export class ItemSlidingCardComponent implements OnInit {
    @Input({ required: true }) itemSlidingProps: ItemSlidingProps;
    @Output() itemSlidingDelete: EventEmitter<number> = new EventEmitter();
    @Output() itemSlidingEdit: EventEmitter<number> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    public deleteItem(e: Event) {
        e.stopPropagation();
        this.itemSlidingDelete.emit(this.itemSlidingProps.id);
    }

    public editItem(e: Event) {
        e.stopPropagation();
        this.itemSlidingEdit.emit(this.itemSlidingProps.id);
    }
}