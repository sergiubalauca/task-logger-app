import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PacientComponent } from './pacient.component';

describe('PacientComponent', () => {
  let component: PacientComponent;
  let fixture: ComponentFixture<PacientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), PacientComponent]
}).compileComponents();

    fixture = TestBed.createComponent(PacientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
