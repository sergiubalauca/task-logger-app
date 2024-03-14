import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-add-button',
    templateUrl: './add-button.component.html',
    styleUrls: ['./add-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf, NgStyle],
})
export class AddButtonComponent {
    @Input() buttonLabel: string;
    @Input() buttonIcon: string;
    @Input() disabled = false;

    @Output() emitButtonPressed: EventEmitter<void> = new EventEmitter<void>();
}
