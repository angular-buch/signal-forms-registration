import { JsonPipe } from '@angular/common';
import { Component, inject, resource, signal } from '@angular/core';
import {
  Control,
  customError,
  CustomValidationError,
  FieldState,
  form,
  submit,
  ValidationError,
  WithField,
  apply,
  pattern,
  schema,
  applyEach,
  applyWhen,
  disabled,
  email,
  maxLength,
  min,
  minLength,
  required,
  validate,
  validateAsync,
  validateTree,
} from '@angular/forms/signals';

import { RegistrationService } from '../registration-service';
import { IdentityForm, GenderIdentity, identitySchema } from '../identity-form/identity-form';
import { FormError } from '../form-error/form-error';
import { Multiselect } from '../multiselect/multiselect';

export interface RegisterFormData {
  username: string;
  identity: GenderIdentity;
  age: number;
  birthday: Date;
  password: { pw1: string; pw2: string };
  email: string[];
  newsletter: boolean;
  newsletterTopics: string[];
  agreeToTermsAndConditions: boolean;
}

export const formSchema = schema<RegisterFormData>((fieldPath) => {
  // username is required and must be between 3 and 12 characters long
  required(fieldPath.username, { message: 'Username is required' });
  minLength(fieldPath.username, 3, {
    message: 'A username must be at least 3 characters long',
  });
  maxLength(fieldPath.username, 12, {
    message: 'A username can be max. 12 characters long',
  });
  validateAsync(fieldPath.username, {
    // Reactive params
    params: ({ value }) => value(),
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
    errors: (result) => {
      return result
        ? customError({
            kind: 'userExists',
            message: 'The username you entered was already taken',
          })
        : undefined;
    },
  });

  // apply child schema for identity checks
  apply(fieldPath.identity, identitySchema);

  // validate number input
  min(fieldPath.age, 18, { message: 'You must be >=18 years old' });

  // at least one email and each email must match format
  validate(fieldPath.email, ({ value }) =>
    !value().some((e) => e)
      ? customError({
          kind: 'atLeastOneEmail',
          message: 'At least one E-Mail address must be added',
        })
      : undefined
  );
  applyEach(fieldPath.email, (emailPath) => {
    email(emailPath, { message: 'E-Mail format is invalid' });
  });

  // passwords are required and must match
  required(fieldPath.password.pw1, { message: 'A password is required' });
  required(fieldPath.password.pw2, {
    message: 'A password confirmation is required',
  });
  minLength(fieldPath.password.pw1, 8, {
    message: 'A password must be at least 8 characters long',
  });
  pattern(
    fieldPath.password.pw1,
    new RegExp('^.*[!@#$%^&*(),.?":{}|<>\\[\\]\\\\/~`_+=;\'\\-].*$'),
    { message: 'The passwort must contain at least one special character' }
  );
  validateTree(fieldPath.password, ({ valueOf, fieldOf }) => {
    return valueOf(fieldPath.password.pw2) === valueOf(fieldPath.password.pw1)
      ? undefined
      : customError({
          field: fieldOf(fieldPath.password.pw2), // assign the error to the seconds password field
          kind: 'confirmationPassword',
          message: 'The entered password must match with the one specified in "Password" field',
        });
  });

  // checkbox must be activated
  required(fieldPath.agreeToTermsAndConditions, {
    message: 'You must agree to the terms and conditions',
  });

  // apply conditionally: only when subscribe to newsletter, rules apply and at least one topic must be selected
  applyWhen(
    fieldPath,
    ({ value }) => value().newsletter,
    (fieldPathWhenTrue) => {
      validate(fieldPathWhenTrue.newsletterTopics, ({ value }) =>
        !value().length
          ? customError({
              kind: 'noTopicSelected',
              message: 'Select at least one newsletter topic',
            })
          : undefined
      );
    }
  );

  // disable topics selection when checkbox for subscription was not activated
  disabled(fieldPath.newsletterTopics, ({ valueOf }) => !valueOf(fieldPath.newsletter));
});

const initialState: RegisterFormData = {
  username: '',
  identity: {
    gender: '',
    salutation: '',
    pronoun: '',
  },
  age: 18, // FIMXE (not implemented yet in Angular): when input changes it will be a string again :/
  birthday: new Date(), // FIMXE (not implemented yet in Angular): it will be a string (format: yyyy-mm-dd) when input changes
  password: { pw1: '', pw2: '' },
  email: [''],
  newsletter: false,
  newsletterTopics: ['Angular'],
  agreeToTermsAndConditions: false,
};

@Component({
  selector: 'app-registration-form',
  imports: [Control, JsonPipe, FormError, IdentityForm, Multiselect],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
})
export class RegistrationForm {
  private readonly registrationService = inject(RegistrationService);
  protected readonly registrationModel = signal<RegisterFormData>(initialState);

  protected readonly registrationForm = form(this.registrationModel, formSchema);

  protected ariaInvalidState(field: FieldState<string | boolean | number>): boolean | undefined {
    const errors = field.errors();
    if (!field.touched()) {
      return undefined;
    } else {
      return errors.length > 0 && field.touched();
    }
  }

  protected addEmail(e: Event): boolean {
    this.registrationForm.email().value.update((items) => [...items, '']);
    e.preventDefault();
    return false;
  }

  protected removeEmail(removeIndex: number): void {
    this.registrationForm
      .email()
      .value.update((items) => items.filter((_, index) => index !== removeIndex));
  }

  protected async submit(e: Event) {
    e?.preventDefault();

    // validate when submitting and assign possible errors for matching field for showing in the UI
    await submit(this.registrationForm, async (form) => {
      const errors: WithField<CustomValidationError | ValidationError>[] = [];

      try {
        await this.registrationService.registerUser(form().value);
      } catch (e) {
        errors.push(
          customError({
            field: form,
            error: {
              kind: 'serverError',
              message: 'There was an server error, please try again (should work after 3rd try)',
            },
          })
        );
      }

      setTimeout(() => this.reset(), 3000);
      return errors;
    });
  }

  // Reset form
  protected reset() {
    this.registrationModel.set(initialState);
    this.registrationForm().reset();
  }
}
