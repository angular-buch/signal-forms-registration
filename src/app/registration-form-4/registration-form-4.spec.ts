import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RegistrationForm4 } from './registration-form-4';

describe('RegistrationForm4', () => {
  let component: RegistrationForm4;
  let fixture: ComponentFixture<RegistrationForm4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm4],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm4);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
