import { TestBed, inject } from '@angular/core/testing';

import { StatusinfoService } from './statusinfo.service';

describe('StatusinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusinfoService]
    });
  });

  it('should be created', inject([StatusinfoService], (service: StatusinfoService) => {
    expect(service).toBeTruthy();
  }));
});
