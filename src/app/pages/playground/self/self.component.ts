import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-self',
    templateUrl: './self.component.html',
    styleUrls: ['./self.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule],
})
export class SelfComponent implements OnInit {
    constructor() {
        console.log('SelfComponent constructor');
    }

    ngOnInit() {}
}
