import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedInterviews } from './completed-interviews';

describe('CompletedInterviews', () => {
  let component: CompletedInterviews;
  let fixture: ComponentFixture<CompletedInterviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedInterviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedInterviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
