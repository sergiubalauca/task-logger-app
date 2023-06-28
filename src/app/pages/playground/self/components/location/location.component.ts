import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PayLocation } from '../../models/pay-location.interface';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class LocationComponent implements OnInit {
    @Input({
        required: true,
    })
    location: PayLocation;

    @Output() locationChecked: EventEmitter<PayLocation> = new EventEmitter(null);

    constructor() {}

    ngOnInit() {}

    public checkLocation() {
        this.locationChecked.emit(this.location);
    }
}
