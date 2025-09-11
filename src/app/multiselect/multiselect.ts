import { Component, effect, input, model } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Component({
  selector: 'app-multiselect',
  imports: [],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.scss',
})
export class Multiselect implements FormValueControl<string[]> {
  readonly allTopics = ['Angular', 'Vue', 'React'];
  readonly value = model<string[]>([]);
  readonly label = input.required<string>();
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);

  changeInput(topic: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const isInModel = this.value().includes(topic) && checked;
    if (!isInModel && checked) {
      this.value.update((current) => [...current, topic]);
      return;
    }
    if (!checked) {
      this.value.update((current) => current.filter((t) => t !== topic));
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
