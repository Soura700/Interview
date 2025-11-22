import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Unauthorized401 } from './unauthorized-401';

describe('Unauthorized401', () => {
  let component: Unauthorized401;
  let fixture: ComponentFixture<Unauthorized401>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unauthorized401]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Unauthorized401);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
