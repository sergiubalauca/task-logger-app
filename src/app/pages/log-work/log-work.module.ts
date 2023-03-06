import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared';
import { LogWorkComponent } from './log-work.component';
import { LogWorkRoutingModule } from './log-work-routing.module';

@NgModule({
  declarations: [LogWorkComponent],
  imports: [CommonModule, IonicModule, LogWorkRoutingModule, SharedModule],
  // imports: [CommonModule, FormsModule, IonicModule, TranslateModule, SharedModule, ReactiveFormsModule],
})
export class LogWorkModule {}
