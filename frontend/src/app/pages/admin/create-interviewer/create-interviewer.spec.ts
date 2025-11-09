import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInterviewer } from './create-interviewer';

describe('CreateInterviewer', () => {
  let component: CreateInterviewer;
  let fixture: ComponentFixture<CreateInterviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInterviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInterviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
