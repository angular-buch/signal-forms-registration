import { Component, inject, resource, signal } from '@angular/core';
import {
  apply,
  applyEach,
  applyWhen,
  debounce,
  disabled,
  email,
  FormField,
  form,
  maxLength,
  metadata,
  min,
  minLength,
  pattern,
  required,
  schema,
  FormRoot,
  validate,
  validateAsync,
  validateTree,
  ValidationError,
  WithFieldTree,
} from '@angular/forms/signals';

import { BackButton } from '../back-button/back-button';
import { DebugOutput } from '../debug-output/debug-output';
import { FormFieldInfo } from '../form-field-info/form-field-info';
import { FIELD_INFO } from '../form-props';
import { FieldAriaAttributes } from '../field-aria-attributes';
import {
  GenderIdentity,
  IdentityForm,
  identitySchema,
  initialGenderIdentityState,
} from '../identity-form/identity-form';
import { Multiselect } from '../multiselect/multiselect';
import { RegistrationService } from '../registration-service';

export interface RegisterFormData {
  username: string;
  identity: GenderIdentity;
  age: number;
  password: { pw1: string; pw2: string };
  email: string[];
  newsletter: boolean;
  newsletterTopics: string[];
  agreeToTermsAndConditions: boolean;
}

const initialState: RegisterFormData = {
  username: '',
  identity: initialGenderIdentityState,
  age: 18,
  password: { pw1: '', pw2: '' },
  email: [''],
  newsletter: true,
  newsletterTopics: ['Angular'],
  agreeToTermsAndConditions: false,
};

export const formSchema = schema<RegisterFormData>((path) => {
  // Username validation
  required(path.username, { message: 'Username is required.' });
  minLength(path.username, 3, { message: 'A username must be at least 3 characters long.' });
  maxLength(path.username, 12, { message: 'A username can be max. 12 characters long.' });
  debounce(path.username, 500);
  validateAsync(path.username, {
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
            message: 'The username you entered was already taken.',
          }
        : undefined;
    },
    onError: () => undefined,
  });
  metadata(path.username, FIELD_INFO, () => 'A username must consist of 3-12 characters.');

  // Age validation
  min(path.age, 18, { message: 'You must be >=18 years old.' });

  // Terms and conditions
  required(path.agreeToTermsAndConditions, {
    message: 'You must agree to the terms and conditions.',
  });

  // E-mail validation
  validate(path.email, (ctx) =>
    !ctx.value().some((e) => e)
      ? {
          kind: 'atLeastOneEmail',
          message: 'At least one E-mail address must be added.',
        }
      : undefined,
  );
  applyEach(path.email, (emailPath) => {
    email(emailPath, { message: 'E-mail format is invalid.' });
  });
  metadata(path.email, FIELD_INFO, () => 'Please enter at least one valid E-mail address');

  // Password validation
  required(path.password.pw1, { message: 'A password is required.' });
  required(path.password.pw2, {
    message: 'A password confirmation is required.',
  });
  minLength(path.password.pw1, 8, {
    message: 'A password must be at least 8 characters long.',
  });
  pattern(
    path.password.pw1,
    new RegExp('^.*[!@#$%^&*(),.?":{}|<>\\[\\]\\\\/~`_+=;\'\\-].*$'),
    { message: 'The password must contain at least one special character.' },
  );
  validateTree(path.password, (ctx) => {
    return ctx.value().pw2 === ctx.value().pw1
      ? undefined
      : {
          field: ctx.fieldTree.pw2, // assign the error to the second password field
          kind: 'confirmationPassword',
          message: 'The entered password must match with the one specified in "Password" field.',
        };
  });
  metadata(
    path.password,
    FIELD_INFO,
    () => 'Please enter a password with min 8 characters and a special character.',
  );

  // Newsletter validation
  applyWhen(
    path,
    (ctx) => ctx.value().newsletter,
    (pathWhenTrue) => {
      validate(pathWhenTrue.newsletterTopics, (ctx) =>
        !ctx.value().length
          ? {
              kind: 'noTopicSelected',
              message: 'Select at least one newsletter topic.',
            }
          : undefined,
      );
    },
  );

  // Disable newsletter topics when newsletter is unchecked
  disabled(path.newsletterTopics, (ctx) => !ctx.valueOf(path.newsletter));

  // apply child schema for identity checks
  apply(path.identity, identitySchema);
});

@Component({
  selector: 'app-registration-form-4',
  imports: [
    BackButton,
    FormField,
    DebugOutput,
    FormFieldInfo,
    IdentityForm,
    Multiselect,
    FieldAriaAttributes,
    FormRoot,
  ],
  templateUrl: './registration-form-4.html',
  styleUrl: './registration-form-4.scss',
  // Also possible: set SignalFormsConfig only for local component:
  // providers: [
  //   provideSignalFormsConfig(signalFormsConfig)
  // ]
})
export class RegistrationForm4 {
  readonly #registrationService = inject(RegistrationService);
  protected readonly registrationModel = signal<RegisterFormData>(initialState);

  protected readonly registrationForm = form(
    this.registrationModel,
    formSchema,
    {
      submission: {
        action: async (form) => {
          const errors: WithFieldTree<ValidationError>[] = [];

          try {
            await this.#registrationService.registerUser(form().value);
            setTimeout(() => this.resetForm(), 3000);
          } catch (e) {
            errors.push({
              fieldTree: form,
              kind: 'serverError',
              message: 'There was a server error, please try again (should work after 3rd try).',
            });
          }

          return errors;
        },
      },
    }
  );

  protected addEmail(): void {
    this.registrationForm.email().value.update((items) => [...items, '']);
  }

  protected removeEmail(removeIndex: number): void {
    const foo = this.registrationForm.email[0];
    this.registrationForm
      .email()
      .value.update((items) => items.filter((_, index) => index !== removeIndex));
  }

  // Reset form
  protected resetForm() {
    this.registrationModel.set(initialState);
    this.registrationForm().reset();
  }
}
