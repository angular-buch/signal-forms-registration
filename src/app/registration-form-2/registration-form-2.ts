import { Component, inject, resource, signal } from '@angular/core';
import {
  applyEach,
  applyWhen,
  FormField,
  disabled,
  email,
  FieldTree,
  form,
  maxLength,
  min,
  minLength,
  pattern,
  required,
  schema,
  submit,
  validate,
  validateAsync,
  validateTree,
  ValidationError,
  WithFieldTree,
} from '@angular/forms/signals';

import { BackButton } from '../back-button/back-button';
import { DebugOutput } from '../debug-output/debug-output';
import { FormError } from '../form-error/form-error';
import { RegistrationService } from '../registration-service';

export interface RegisterFormData {
  username: string;
  age: number;
  password: { pw1: string; pw2: string };
  email: string[];
  newsletter: boolean;
  newsletterTopics: string;
  agreeToTermsAndConditions: boolean;
}

const initialState: RegisterFormData = {
  username: '',
  age: 18,
  password: { pw1: '', pw2: '' },
  email: [''],
  newsletter: false,
  newsletterTopics: '',
  agreeToTermsAndConditions: false,
};

export const formSchema = schema<RegisterFormData>((schemaPath) => {
  // Username validation
  required(schemaPath.username, { message: 'Username is required' });
  minLength(schemaPath.username, 3, { message: 'A username must be at least 3 characters long' });
  maxLength(schemaPath.username, 12, { message: 'A username can be max. 12 characters long' });
  validateAsync(schemaPath.username, {
    // Reactive params
    params: (ctx) => ctx.value(),
    // Factory creating a resource
    factory: (params) => {
      const registrationService = inject(RegistrationService);
      return resource({
        params,
        loader: async ({ params }) => {
          return await registrationService.checkUserExists(params);
        },
      });
    },
    // Maps resource to error
    onSuccess: (result) => {
      return result
        ? {
            kind: 'userExists',
            message: 'The username you entered was already taken',
          }
        : undefined;
    },
    onError: () => undefined,
  });

  // Age validation
  min(schemaPath.age, 18, { message: 'You must be >=18 years old.' });

  // Terms and conditions
  required(schemaPath.agreeToTermsAndConditions, {
    message: 'You must agree to the terms and conditions.',
  });

  // E-Mail validation
  validate(schemaPath.email, (ctx) =>
    !ctx.value().some((e) => e)
      ? {
          kind: 'atLeastOneEmail',
          message: 'At least one E-Mail address must be added',
        }
      : undefined,
  );
  applyEach(schemaPath.email, (emailPath) => {
    email(emailPath, { message: 'E-Mail format is invalid' });
  });

  // Password validation
  required(schemaPath.password.pw1, { message: 'A password is required' });
  required(schemaPath.password.pw2, {
    message: 'A password confirmation is required',
  });
  minLength(schemaPath.password.pw1, 8, {
    message: 'A password must be at least 8 characters long',
  });
  pattern(
    schemaPath.password.pw1,
    new RegExp('^.*[!@#$%^&*(),.?":{}|<>\\[\\]\\\\/~`_+=;\'\\-].*$'),
    { message: 'The passwort must contain at least one special character' },
  );
  validateTree(schemaPath.password, (ctx) => {
    return ctx.value().pw2 === ctx.value().pw1
      ? undefined
      : {
          field: ctx.fieldTree.pw2, // assign the error to the second password field
          kind: 'confirmationPassword',
          message: 'The entered password must match with the one specified in "Password" field',
        };
  });

  // Newsletter validation
  applyWhen(
    schemaPath,
    (ctx) => ctx.value().newsletter,
    (schemaPathWhenTrue) => {
      validate(schemaPathWhenTrue.newsletterTopics, (ctx) =>
        !ctx.value().length
          ? {
              kind: 'noTopicSelected',
              message: 'Select at least one newsletter topic',
            }
          : undefined,
      );
    },
  );

  // Disable newsletter topics when newsletter is unchecked
  disabled(schemaPath.newsletterTopics, (ctx) => !ctx.valueOf(schemaPath.newsletter));
});

@Component({
  selector: 'app-registration-form-2',
  imports: [BackButton, FormField, DebugOutput, FormError],
  templateUrl: './registration-form-2.html',
  styleUrl: './registration-form-2.scss',
})
export class RegistrationForm2 {
  readonly #registrationService = inject(RegistrationService);
  protected readonly registrationModel = signal<RegisterFormData>(initialState);

  protected readonly registrationForm = form(this.registrationModel, formSchema, {
    submission: {
      action: async (form) => {
        const errors: WithFieldTree<ValidationError>[] = [];

        try {
          await this.#registrationService.registerUser(form().value);
        } catch (e) {
          errors.push({
            fieldTree: form,
            kind: 'serverError',
            message: 'There was an server error, please try again (should work after 3rd try)',
          });
        }

        setTimeout(() => this.resetForm(), 3000);
        return errors;
      },
    },
  });

  protected ariaInvalidState(field: FieldTree<unknown>): boolean | undefined {
    if (field().value() === 'validuser') {
      console.log('###### FIELD:', {
        touched: field().touched(),
        pending: field().pending(),
        errors: field().errors(),
      });
    }
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

  protected submitForm() {
    // validate when submitting and assign possible errors for matching field for showing in the UI
    submit(this.registrationForm);

    // Prevent reloading (default browser behavior)
    return false;
  }

  // Reset form
  protected resetForm() {
    this.registrationModel.set(initialState);
    this.registrationForm().reset();
  }
}
