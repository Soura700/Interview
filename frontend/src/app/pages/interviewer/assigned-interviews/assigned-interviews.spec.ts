import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedInterviews } from './assigned-interviews';

describe('AssignedInterviews', () => {
  let component: AssignedInterviews;
  let fixture: ComponentFixture<AssignedInterviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedInterviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedInterviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
