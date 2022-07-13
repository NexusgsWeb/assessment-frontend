import { TestBed } from '@angular/core/testing';

import { ExamrunningService } from './examrunning.service';

describe('ExamrunningService', () => {
  let service: ExamrunningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamrunningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
