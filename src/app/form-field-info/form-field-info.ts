import { Component, computed, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

import { FIELD_INFO } from '../form-props';

@Component({
  selector: 'app-form-field-info',
  imports: [],
  templateUrl: './form-field-info.html',
  styleUrl: './form-field-info.scss',
})
export class FormFieldInfo<T> {
  readonly fieldRef = input.required<FieldTree<T>>();

  protected readonly messages = computed(() => {
    const field = this.fieldRef()();
    let messages: { info: string; cssClass: 'info' | 'pending' | 'valid' | 'invalid' }[] = [];

    if (field.pending()) {
      messages = [{ info: 'Checking availability ...', cssClass: 'pending' }];
    } else if (field.touched() && field.errors().length > 0) {
      messages = field.errors().map((e) => ({ info: e.message || 'Invalid', cssClass: 'invalid' }));
    } else if (field.hasMetadata(FIELD_INFO)) {
      messages = [{ info: field.metadata(FIELD_INFO)!, cssClass: field.valid() ? 'valid': 'info' }];
    }
    return messages;
  });
}
