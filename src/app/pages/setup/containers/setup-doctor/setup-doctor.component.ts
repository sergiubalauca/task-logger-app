import { Component, OnInit } from '@angular/core';
import { Doctor } from '@shared';
import { NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
    selector: 'app-setup-doctor',
    templateUrl: './setup-doctor.component.html',
    styleUrls: ['./setup-doctor.component.scss'],
    standalone: true,
    imports: [
        HeaderComponent,
        IonicModule,
        NgFor,
    ],
})
export class SetupDoctorComponent implements OnInit {
    public doctors: Doctor[] = [
        {
            name: 'Dr. John Doe',
            phone: '123-456-7890',
        },
        {
            name: 'Dr. Jane Doe',
            phone: '123-456-7890',
        },
    ];
    constructor() {}

    ngOnInit() {}
}
