import { Component, inject, resource, signal } from '@angular/core';
import { apply, applyEach, applyWhen, Field, customError, CustomValidationError, disabled, email, FieldTree, form, maxLength, min, minLength, pattern, required, schema, submit, validate, validateAsync, validateTree, ValidationError, WithField } from '@angular/forms/signals';

import { BackButton } from '../back-button/back-button';
import { DebugOutput } from '../debug-output/debug-output';
import { FormError } from '../form-error/form-error';
import { GenderIdentity, IdentityForm, identitySchema, initialGenderIdentityState } from '../identity-form/identity-form';
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

export const formSchema = schema<RegisterFormData>((fieldPath) => {
  // Username validation
  required(fieldPath.username, { message: 'Username is required' });
  minLength(fieldPath.username, 3, { message: 'A username must be at least 3 characters long' });
  maxLength(fieldPath.username, 12, { message: 'A username can be max. 12 characters long' });
  validateAsync(fieldPath.username, {
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
        ? customError({
            kind: 'userExists',
            message: 'The username you entered was already taken',
          })
        : undefined;
    },
    onError: () => undefined
  });

  // Age validation
  min(fieldPath.age, 18, { message: 'You must be >=18 years old.' });

  // Terms and conditions
  required(fieldPath.agreeToTermsAndConditions, {
    message: 'You must agree to the terms and conditions.',
  });

  // E-Mail validation
  validate(fieldPath.email, (ctx) =>
    !ctx.value().some((e) => e)
      ? customError({
          kind: 'atLeastOneEmail',
          message: 'At least one E-Mail address must be added',
        })
      : undefined
  );
  applyEach(fieldPath.email, (emailPath) => {
    email(emailPath, { message: 'E-Mail format is invalid' });
  });

  // Password validation
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
  validateTree(fieldPath.password, (ctx) => {
    return ctx.value().pw2 === ctx.value().pw1
      ? undefined
      : customError({
          field: ctx.fieldOf(fieldPath.password.pw2), // assign the error to the second password field
          kind: 'confirmationPassword',
          message: 'The entered password must match with the one specified in "Password" field',
        });
  });

  // Newsletter validation
  applyWhen(
    fieldPath,
    (ctx) => ctx.value().newsletter,
    (fieldPathWhenTrue) => {
      validate(fieldPathWhenTrue.newsletterTopics, (ctx) =>
        !ctx.value().length
          ? customError({
              kind: 'noTopicSelected',
              message: 'Select at least one newsletter topic',
            })
          : undefined
      );
    }
  );

  // Disable newsletter topics when newsletter is unchecked
  disabled(fieldPath.newsletterTopics, (ctx) => !ctx.valueOf(fieldPath.newsletter));

  // apply child schema for identity checks
  apply(fieldPath.identity, identitySchema);
});

@Component({
  selector: 'app-registration-form-3',
  imports: [BackButton, Field, DebugOutput, FormError, IdentityForm, Multiselect],
  templateUrl: './registration-form-3.html',
  styleUrl: './registration-form-3.scss',
})
export class RegistrationForm3 {
  readonly #registrationService = inject(RegistrationService);
  protected readonly registrationModel = signal<RegisterFormData>(initialState);

  protected readonly registrationForm = form(this.registrationModel, formSchema);

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

  protected async submitForm(e: Event) {
    e.preventDefault();

    // validate when submitting and assign possible errors for matching field for showing in the UI
    await submit(this.registrationForm, async (form) => {
      const errors: WithField<CustomValidationError | ValidationError>[] = [];

      try {
        await this.#registrationService.registerUser(form().value);
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

      setTimeout(() => this.resetForm(), 3000);
      return errors;
    });
  }

  // Reset form
  protected resetForm() {
    this.registrationModel.set(initialState);
    this.registrationForm().reset();
  }
}
