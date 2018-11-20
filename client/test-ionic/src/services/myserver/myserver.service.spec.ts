import { TestBed } from '@angular/core/testing';

import { MyserverService } from './myserver.service';

describe('MyserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyserverService = TestBed.get(MyserverService);
    expect(service).toBeTruthy();
  });
});
