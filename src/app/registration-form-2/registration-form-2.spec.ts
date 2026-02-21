import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

import { RegistrationService } from '../registration-service';
import { RegistrationForm2 } from './registration-form-2';

describe('RegistrationForm2', () => {
  let component: RegistrationForm2;
  let fixture: ComponentFixture<RegistrationForm2>;
  let registrationService: RegistrationService;

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm2],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm2);
    component = fixture.componentInstance;
    registrationService = TestBed.inject(RegistrationService);
    TestBed.tick();
    await fixture.whenStable();
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
      age: 18,
      password: { pw1: '', pw2: '' },
      email: [''],
      newsletter: false,
      newsletterTopics: '',
      agreeToTermsAndConditions: false,
    });
  });

  it('should validate username field', () => {
    const usernameField = component['registrationForm'].username();

    // Test required validation
    usernameField.value.set('');
    usernameField.markAsTouched();
    expect(usernameField.errors().length).toBe(1);
    expect(usernameField.errors()[0].message).toBe('Username is required.');

    // Test minLength validation
    usernameField.value.set('ab');
    expect(usernameField.errors().length).toBe(1);
    expect(usernameField.errors()[0].message).toBe(
      'A username must be at least 3 characters long.'
    );

    // Test maxLength validation
    usernameField.value.set('verylongusername');
    expect(usernameField.errors().length).toBe(1);
    expect(usernameField.errors()[0].message).toBe('A username can be max. 12 characters long.');

    // Test valid username
    usernameField.value.set('validuser');
    expect(usernameField.errors()).toEqual([]);
  });

  it('should validate age field', () => {
    const ageField = component['registrationForm'].age();

    ageField.value.set(17);
    ageField.markAsTouched();
    expect(ageField.errors().length).toBe(1);
    expect(ageField.errors()[0].message).toBe('You must be >=18 years old.');

    ageField.value.set(18);
    expect(ageField.errors()).toEqual([]);
  });

  it('should validate terms and conditions', () => {
    const termsField = component['registrationForm'].agreeToTermsAndConditions();

    termsField.value.set(false);
    termsField.markAsTouched();
    expect(termsField.errors().length).toBe(1);
    expect(termsField.errors()[0].message).toBe('You must agree to the terms and conditions.');

    termsField.value.set(true);
    expect(termsField.errors()).toEqual([]);
  });

  it('should validate password fields', () => {
    const pw1Field = component['registrationForm'].password.pw1();
    const pw2Field = component['registrationForm'].password.pw2();

    // Test required validation for pw1
    pw1Field.value.set('');
    pw1Field.markAsTouched();
    expect(pw1Field.errors().length).toBe(1);
    expect(pw1Field.errors()[0].message).toBe('A password is required.');

    // Test required validation for pw2
    pw2Field.value.set('');
    pw2Field.markAsTouched();
    expect(pw2Field.errors().length).toBe(1);
    expect(pw2Field.errors()[0].message).toBe('A password confirmation is required.');

    // Test minLength validation
    pw1Field.value.set('short$');
    expect(pw1Field.errors().length).toBe(1);
    expect(pw1Field.errors()[0].message).toBe('A password must be at least 8 characters long.');

    // Test special character validation
    pw1Field.value.set('password123');
    expect(pw1Field.errors().length).toBe(1);
    expect(pw1Field.errors()[0].message).toBe('The password must contain at least one special character.');

    // Test password confirmation mismatch
    pw1Field.value.set('password123!');
    pw2Field.value.set('different123!');
    pw2Field.markAsTouched();
    component['registrationForm'].password().markAsTouched();
    const passwordErrors = component['registrationForm'].password().errors();
    expect(passwordErrors.length).toBe(1);
    expect(passwordErrors[0].message).toBe('The entered password must match with the one specified in "Password" field.');

    // Test valid passwords
    pw1Field.value.set('password123!');
    pw2Field.value.set('password123!');
    expect(pw1Field.errors()).toEqual([]);
    expect(pw2Field.errors()).toEqual([]);
  });

  it('should validate email fields', () => {
    const emailField = component['registrationForm'].email();

    // Test at least one email required
    emailField.value.set(['']);
    emailField.markAsTouched();
    expect(emailField.errors().length).toBe(1);
    expect(emailField.errors()[0].message).toBe('At least one E-mail address must be added.');

    // Test email format validation
    emailField.value.set(['invalid-email']);
    expect(emailField.errors()).toEqual([]);
    const firstEmailField = component['registrationForm'].email[0]();
    expect(firstEmailField.errors().length).toBe(1);
    expect(firstEmailField.errors()[0].message).toBe('E-mail format is invalid.');

    // Test valid email
    emailField.value.set(['test@example.com']);
    expect(emailField.errors()).toEqual([]);
    expect(firstEmailField.errors()).toEqual([]);
  });

  it('should validate newsletter topics conditionally', () => {
    const newsletterField = component['registrationForm'].newsletter();
    const topicsField = component['registrationForm'].newsletterTopics();

    // Newsletter unchecked - topics should be disabled and no validation
    newsletterField.value.set(false);
    expect(topicsField.disabled()).toBe(true);

    // Newsletter checked but no topics selected
    newsletterField.value.set(true);
    topicsField.value.set('');
    topicsField.markAsTouched();
    expect(topicsField.disabled()).toBe(false);
    expect(topicsField.errors().length).toBe(1);
    expect(topicsField.errors()[0].message).toBe('Select at least one newsletter topic.');

    // Newsletter checked with topics selected
    topicsField.value.set('tech,news');
    expect(topicsField.errors()).toEqual([]);
  });

  it('should validate username asynchronously', async () => {
    const spy = vi.spyOn(registrationService, 'checkUserExists').mockResolvedValue(true);
    const usernameField = component['registrationForm'].username();

    usernameField.value.set('existinguser');
    usernameField.markAsTouched();

    // Wait for async validation
    await vi.waitFor(() => {
      expect(usernameField.errors().length).toBe(1);
      expect(usernameField.errors()[0].message).toBe('The username you entered was already taken.');
    });

    expect(spy).toHaveBeenCalledWith('existinguser');
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
      age: 18,
      password: { pw1: '', pw2: '' },
      email: [''],
      newsletter: false,
      newsletterTopics: '',
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

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    vi.runAllTimers();

    expect(spy).toHaveBeenCalled();
  });

  it('should render form elements', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="number"]')).toBeTruthy();
    expect(compiled.querySelector('input[type="email"]')).toBeTruthy();
    expect(compiled.querySelectorAll('input[type="checkbox"]')).toHaveLength(2);
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="reset"]')).toBeTruthy();
  });
});
