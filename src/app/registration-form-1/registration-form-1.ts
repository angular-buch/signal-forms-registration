import { Component, inject, signal } from '@angular/core';
import {
  FormField,
  FieldTree,
  form,
  maxLength,
  min,
  minLength,
  required,
  schema,
  FormRoot,
} from '@angular/forms/signals';

import { FormError } from '../form-error/form-error';
import { RegistrationService } from '../registration-service';
import { DebugOutput } from '../debug-output/debug-output';
import { BackButton } from '../back-button/back-button';

interface RegisterFormData {
  username: string;
  age: number;
  email: string[];
  newsletter: boolean;
  agreeToTermsAndConditions: boolean;
}

const initialState: RegisterFormData = {
  username: '',
  age: 18,
  email: [''],
  newsletter: false,
  agreeToTermsAndConditions: false,
};

const formSchema = schema<RegisterFormData>((schemaPath) => {
  // Username validation
  required(schemaPath.username, { message: 'Username is required.' });
  minLength(schemaPath.username, 3, { message: 'A username must be at least 3 characters long.' });
  maxLength(schemaPath.username, 12, { message: 'A username can be max. 12 characters long.' });

  // Age validation
  min(schemaPath.age, 18, { message: 'You must be >=18 years old.' });

  // Terms and conditions
  required(schemaPath.agreeToTermsAndConditions, {
    message: 'You must agree to the terms and conditions.',
  });
});

@Component({
  selector: 'app-registration-form-1',
  imports: [BackButton, FormField, DebugOutput, FormError, FormRoot],
  templateUrl: './registration-form-1.html',
  styleUrl: './registration-form-1.scss',
})
export class RegistrationForm1 {
  readonly #registrationService = inject(RegistrationService);
  protected readonly registrationModel = signal<RegisterFormData>(initialState);

  protected readonly registrationForm = form(this.registrationModel, formSchema, {
    submission: {
      action: async (form) => {
        await this.#registrationService.registerUser(form().value);
        console.log('Registration successful!');
        this.resetForm();
      },
    },
  });

  protected ariaInvalidState(field: FieldTree<unknown>): boolean | undefined {
    return field().touched() && !field().pending() ? field().errors().length > 0 : undefined;
  }

  protected addEmail(): void {
    this.registrationForm.email().value.update((items) => [...items, '']);
  }

  protected removeEmail(removeIndex: number): void {
    this.registrationForm
      .email()
      .value.update((items) => items.filter((_, index) => index !== removeIndex));
  }

  protected resetForm() {
    this.registrationModel.set(initialState);
    this.registrationForm().reset();
  }
}
