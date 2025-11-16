import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerHome } from './interviewer-home';

describe('InterviewerHome', () => {
  let component: InterviewerHome;
  let fixture: ComponentFixture<InterviewerHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewerHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewerHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});