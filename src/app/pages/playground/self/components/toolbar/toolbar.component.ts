import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { map, Observable, of } from 'rxjs';
import { PayLocation } from '../../models/pay-location.interface';
import { PayLocationService } from '../../services/pay-location.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class ToolbarComponent implements OnInit {
    public saveButtonEnabled$: Observable<boolean> = of(false);

    constructor(private readonly locationService: PayLocationService) {}

    ngOnInit() {
        this.saveButtonEnabled$ = this.locationService.locationSelected$.pipe(
            map((locations: PayLocation[]) => {
                console.log('Locations selected: ', locations);
                return locations.length > 0;
            })
        );
    }
}
