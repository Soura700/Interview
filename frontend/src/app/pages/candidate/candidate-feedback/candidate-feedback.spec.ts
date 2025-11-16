import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFeedback } from './candidate-feedback';

describe('CandidateFeedback', () => {
  let component: CandidateFeedback;
  let fixture: ComponentFixture<CandidateFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
