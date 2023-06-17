import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PlaygroundPage } from './playground.page';

import { HomePageRoutingModule } from './playground-routing.module';
import { TestComponent } from './test/test.component';
import { Test2Component } from './test2/test2.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        PlaygroundPage,
        TestComponent,
        Test2Component,
    ],
})
export class PlaygroundModule {}
