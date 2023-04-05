import { TestBed } from '@angular/core/testing';

import { MultiStepFormService } from './multi-step-form.service';

describe('MultiStepFormService', () => {
  let service: MultiStepFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiStepFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
