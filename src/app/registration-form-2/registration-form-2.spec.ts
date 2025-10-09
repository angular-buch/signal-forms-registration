import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationForm2 } from './registration-form-2';

describe('RegistrationForm2', () => {
  let component: RegistrationForm2;
  let fixture: ComponentFixture<RegistrationForm2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm2],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
