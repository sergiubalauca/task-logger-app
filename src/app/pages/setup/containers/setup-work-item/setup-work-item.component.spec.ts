import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SetupWorkItemComponent } from './setup-work-item.component';

describe('SetupWorkItemComponent', () => {
  let component: SetupWorkItemComponent;
  let fixture: ComponentFixture<SetupWorkItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), SetupWorkItemComponent]
}).compileComponents();

    fixture = TestBed.createComponent(SetupWorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
