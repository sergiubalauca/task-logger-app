import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetupDoctorComponent } from './setup-doctor.component';

describe('SetupDoctorComponent', () => {
  let component: SetupDoctorComponent;
  let fixture: ComponentFixture<SetupDoctorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), SetupDoctorComponent]
}).compileComponents();

    fixture = TestBed.createComponent(SetupDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
