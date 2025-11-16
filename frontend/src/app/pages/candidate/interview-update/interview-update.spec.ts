import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewUpdate } from './interview-update';

describe('InterviewUpdate', () => {
  let component: InterviewUpdate;
  let fixture: ComponentFixture<InterviewUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
