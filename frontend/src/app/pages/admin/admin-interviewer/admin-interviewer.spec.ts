import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInterviewer } from './admin-interviewer';

describe('AdminInterviewer', () => {
  let component: AdminInterviewer;
  let fixture: ComponentFixture<AdminInterviewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInterviewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInterviewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
