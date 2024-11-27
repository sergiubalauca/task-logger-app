import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LocationSelectorComponent } from './components/location-selector/location-selector.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@Component({
    selector: 'app-self',
    templateUrl: './self.page.html',
    styleUrls: ['./self.page.scss'],
    imports: [
        CommonModule,
        IonicModule,
        LocationSelectorComponent,
        ToolbarComponent,
    ]
})
export class SelfPage implements OnInit {
    constructor() {}

    ngOnInit() {}
}
