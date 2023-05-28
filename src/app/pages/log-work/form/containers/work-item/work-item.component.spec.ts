import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkItemComponent } from './work-item.component';

describe('WorkItemComponent', () => {
  let component: WorkItemComponent;
  let fixture: ComponentFixture<WorkItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IonicModule.forRoot(), WorkItemComponent]
}).compileComponents();

    fixture = TestBed.createComponent(WorkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
