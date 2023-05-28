import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
    selector: 'app-setup-work-item',
    templateUrl: './setup-work-item.component.html',
    styleUrls: ['./setup-work-item.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule],
})
export class SetupWorkItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
