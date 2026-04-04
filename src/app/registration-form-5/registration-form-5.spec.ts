import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RegistrationForm5 } from './registration-form-5';

describe('RegistrationForm5', () => {
  let component: RegistrationForm5;
  let fixture: ComponentFixture<RegistrationForm5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm5],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm5);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
