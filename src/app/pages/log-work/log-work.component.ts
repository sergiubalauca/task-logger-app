import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared';
import { FormModalComponent } from './form/form-modal/form-modal.component';

@Component({
  selector: 'app-log-work',
  templateUrl: './log-work.component.html',
  styleUrls: ['./log-work.component.scss'],
})
export class LogWorkComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit() {}

  public selectDate(event: any) {
    console.log('select date: ', event.detail.value);
    this.modalService.createAndShow(
      FormModalComponent,
      '',
      {
        chosenDate: event.detail.value
      },
      true
    );
  }
}
