import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationForm4 } from './registration-form-4';

describe('RegistrationForm4', () => {
  let component: RegistrationForm4;
  let fixture: ComponentFixture<RegistrationForm4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm4],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
