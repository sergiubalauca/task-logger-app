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
import { RandomUser } from 'src/app/shared/models/random-user';

@Component({
    selector: 'app-test3',
    templateUrl: './test3.component.html',
    styleUrls: ['./test3.component.scss'],
    imports: [CommonModule, IonicModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Test3Component implements OnInit {
    @Input({ required: true }) public user!: RandomUser;

    @Output() public editUser: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();

    @Output() public deleteUser: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();
    @Output() public goToUser: EventEmitter<RandomUser> =
        new EventEmitter<RandomUser>();

    constructor() {}

    ngOnInit() {}

    public loadChild(): void {
        this.goToUser.emit(this.user);
    }

    public edit(): void {
        this.editUser.emit(this.user);
    }
}
