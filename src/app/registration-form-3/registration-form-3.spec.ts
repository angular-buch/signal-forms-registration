import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { RegistrationForm3 } from './registration-form-3';
import { RegistrationService } from '../registration-service';

describe('RegistrationForm3', () => {
  let component: RegistrationForm3;
  let fixture: ComponentFixture<RegistrationForm3>;
  let registrationService: RegistrationService;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm3],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm3);
    component = fixture.componentInstance;
    registrationService = TestBed.inject(RegistrationService);
    fixture.detectChanges();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component['registrationModel']()).toEqual({
      username: '',
      identity: {
        gender: '',
        salutation: '',
        pronoun: '',
      },
      age: 18,
      password: { pw1: '', pw2: '' },
      email: [''],
      newsletter: true,
      newsletterTopics: ['Angular'],
      agreeToTermsAndConditions: false,
    });
  });

  it('should validate username field', () => {
    const usernameField = component['registrationForm'].username();

    // Test required validation
    usernameField.value.set('');
    usernameField.markAsTouched();
    expect(usernameField.errors().length).toEqual(1);
    expect(usernameField.errors()[0].message).toEqual('Username is required');

    // Test minLength validation
    usernameField.value.set('ab');
    expect(usernameField.errors().length).toEqual(1);
    expect(usernameField.errors()[0].message).toEqual(
      'A username must be at least 3 characters long'
    );

    // Test maxLength validation
    usernameField.value.set('verylongusername');
    expect(usernameField.errors().length).toEqual(1);
    expect(usernameField.errors()[0].message).toEqual('A username can be max. 12 characters long');

    // Test valid username
    usernameField.value.set('validuser');
    expect(usernameField.errors()).toEqual([]);
  });

  it('should validate age field', () => {
    const ageField = component['registrationForm'].age();

    ageField.value.set(17);
    ageField.markAsTouched();
    expect(ageField.errors().length).toEqual(1);
    expect(ageField.errors()[0].message).toEqual('You must be >=18 years old.');

    ageField.value.set(18);
    expect(ageField.errors()).toEqual([]);
  });

  it('should validate terms and conditions', () => {
    const termsField = component['registrationForm'].agreeToTermsAndConditions();

    termsField.value.set(false);
    termsField.markAsTouched();
    expect(termsField.errors().length).toEqual(1);
    expect(termsField.errors()[0].message).toEqual('You must agree to the terms and conditions.');

    termsField.value.set(true);
    expect(termsField.errors()).toEqual([]);
  });

  it('should add email field', () => {
    const initialEmailCount = component['registrationForm'].email().value().length;

    component['addEmail']();

    expect(component['registrationForm'].email().value().length).toBe(initialEmailCount + 1);
  });

  it('should remove email field', () => {
    component['addEmail']();
    component['addEmail']();
    const initialCount = component['registrationForm'].email().value().length;

    component['removeEmail'](1);

    expect(component['registrationForm'].email().value().length).toBe(initialCount - 1);
  });

  it('should return correct aria-invalid state', () => {
    const ageField = component['registrationForm'].age;

    // Not touched, should return undefined
    expect(component['ariaInvalidState'](ageField)).toBeUndefined();

    // Touched with errors
    ageField().markAsTouched();
    ageField().value.set(9);
    expect(component['ariaInvalidState'](ageField)).toBe(true);

    // // Touched without errors
    ageField().value.set(25);
    expect(component['ariaInvalidState'](ageField)).toBe(false);
  });

  it('should reset form', () => {
    // Modify form values
    component['registrationForm'].username().value.set('testuser');
    component['registrationForm'].age().value.set(25);
    component['registrationForm'].newsletter().value.set(true);

    component['resetForm']();

    expect(component['registrationModel']()).toEqual({
      username: '',
      identity: {
        gender: '',
        salutation: '',
        pronoun: '',
      },
      age: 18,
      password: { pw1: '', pw2: '' },
      email: [''],
      newsletter: true,
      newsletterTopics: ['Angular'],
      agreeToTermsAndConditions: false,
    });
  });

  it('should submit form successfully', () => {
    const spy = vi.spyOn(registrationService, 'registerUser').mockResolvedValue({});

    // Set valid form data
    component['registrationForm'].username().value.set('testuser');
    component['registrationForm'].age().value.set(25);
    component['registrationForm'].password.pw1().value.set('0123456789_');
    component['registrationForm'].password.pw2().value.set('0123456789_');
    component['registrationForm'].email().value.set(['mail@example.org']);
    component['registrationForm'].agreeToTermsAndConditions().value.set(true);

    const result = component['submitForm']();

    vi.runAllTimers();

    expect(spy).toHaveBeenCalled();
    expect(result).toBe(false); // Prevents default form submission
  });

  it('should render form elements', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="number"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelectorAll('input[type="checkbox"]')).toHaveLength(6);
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="reset"]')).toBeTruthy();
  });
});
