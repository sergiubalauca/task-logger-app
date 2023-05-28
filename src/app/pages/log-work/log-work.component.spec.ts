import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LogWorkComponent } from './log-work.component';

describe('LogWorkComponent', () => {
  let component: LogWorkComponent;
  let fixture: ComponentFixture<LogWorkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), LogWorkComponent]
}).compileComponents();

    fixture = TestBed.createComponent(LogWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
