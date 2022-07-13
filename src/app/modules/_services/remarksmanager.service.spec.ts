import { TestBed } from '@angular/core/testing';

import { RemarksmanagerService } from './remarksmanager.service';

describe('RemarksmanagerService', () => {
  let service: RemarksmanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemarksmanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
