import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerDashboard } from './interviewer-dashboard';

describe('InterviewerDashboard', () => {
  let component: InterviewerDashboard;
  let fixture: ComponentFixture<InterviewerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
