import { TestBed } from '@angular/core/testing';

import { LearningobjectiveManagerService } from './learningobjective-manager.service';

describe('LearningobjectiveManagerService', () => {
  let service: LearningobjectiveManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningobjectiveManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
