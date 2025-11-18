import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewStatus } from './interview-status';

describe('InterviewStatus', () => {
  let component: InterviewStatus;
  let fixture: ComponentFixture<InterviewStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
