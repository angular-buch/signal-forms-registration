import { Component, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { required, minLength } from '@angular/forms/signals';

export type LocationGroup = FormGroup<{
  country: FormControl<string>;
  city: SignalFormControl<string>;
}>;

/**
 * Must be called from an injection context (e.g. a class field initializer)
 * because SignalFormControl uses inject() internally.
 */
export function createLocationGroup(): LocationGroup {
  return new FormGroup({
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new SignalFormControl('', (p) => {
      required(p, { message: 'City is required.' });
      minLength(p, 2, { message: 'City must be at least 2 characters.' });
    }),
  });
}

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.scss',
})
export class LocationForm {
  readonly locationGroup = input.required<LocationGroup>();
}
