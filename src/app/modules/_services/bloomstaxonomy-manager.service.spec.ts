import { TestBed } from '@angular/core/testing';

import { BloomstaxonomyManagerService } from './bloomstaxonomy-manager.service';

describe('BloomstaxonomyManagerService', () => {
  let service: BloomstaxonomyManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloomstaxonomyManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
