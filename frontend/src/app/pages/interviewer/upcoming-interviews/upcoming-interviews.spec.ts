import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingInterviews } from './upcoming-interviews';

describe('UpcomingInterviews', () => {
  let component: UpcomingInterviews;
  let fixture: ComponentFixture<UpcomingInterviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingInterviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingInterviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
