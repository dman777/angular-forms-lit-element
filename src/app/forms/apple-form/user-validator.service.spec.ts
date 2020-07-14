import { TestBed } from '@angular/core/testing';

import { UserValidatorService } from './user-validator.service';

describe('UserValidatorService', () => {
  let service: UserValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
