import { Component, effect, input, model } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'app-multiselect',
  imports: [],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.scss',
})
export class Multiselect implements FormValueControl<string[]> {
  readonly value = model<string[]>([]);
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);

  readonly label = input.required<string>();
  readonly selectOptions = input.required<string[]>();

  changeInput(option: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      // option checked, add to list
      this.value.update((current) => [...current, option]);
    } else {
      // option unchecked, remove from list
      this.value.update((current) => current.filter((o) => o !== option));
    }
  }

  constructor() {
    effect(() => {
      if (this.disabled()) {
        this.value.set([]);
      }
    });
  }
}
