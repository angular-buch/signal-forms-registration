import { Component, input } from '@angular/core';

import { ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
})
export class FormError {
  errors = input<readonly WithOptionalField<ValidationError>[]>([]);
}
