import { Component, input } from '@angular/core';
import { Field } from '@angular/forms/signals';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
})
export class FormError<T> {
  readonly field = input.required<Field<T>>();
}
