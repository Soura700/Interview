import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssignments } from './view-assignments';

describe('ViewAssignments', () => {
  let component: ViewAssignments;
  let fixture: ComponentFixture<ViewAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssignments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssignments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
