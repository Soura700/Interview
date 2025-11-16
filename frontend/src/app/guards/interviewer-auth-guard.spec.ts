import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { interviewerAuthGuard } from './interviewer-auth-guard';

describe('interviewerAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => interviewerAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
