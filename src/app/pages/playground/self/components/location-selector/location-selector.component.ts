import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { PayLocation } from '../../models/pay-location.interface';
import { PayLocationService } from '../../services/pay-location.service';
import { LocationComponent } from '../location/location.component';

@Component({
    selector: 'app-location-selector',
    templateUrl: './location-selector.component.html',
    styleUrls: ['./location-selector.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, LocationComponent],
})
export class LocationSelectorComponent implements OnInit {
    public paymentLocations$: Observable<PayLocation[]> = of(null);

    constructor(private locationService: PayLocationService) {}

    ngOnInit() {
        this.paymentLocations$ = this.locationService.getLocations();
    }

    public locationChecked(location: PayLocation) {
        // console.log('GSB: ', location);
        this.locationService.pushToLocationList(location);
    }
}
