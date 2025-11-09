import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignInterview } from './assign-interview';

describe('AssignInterview', () => {
  let component: AssignInterview;
  let fixture: ComponentFixture<AssignInterview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignInterview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignInterview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
