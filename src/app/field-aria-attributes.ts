import { computed, Directive, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive({
  selector: '[field]',
  host: {
    '[attr.aria-invalid]': 'ariaInvalid()',
    '[attr.aria-busy]': 'ariaBusy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-errormessage]': 'ariaErrorMessage()',
  },
})
export class FieldAriaAttributes<T> {
  readonly field = input.required<FieldTree<T>>();
  readonly fieldDescriptionId = input<string>();

  readonly ariaInvalid = computed(() => {
    const state = this.field()();
    return state.touched() && !state.pending() ? state.errors().length > 0 : undefined;
  });
  readonly ariaBusy = computed(() => {
    const state = this.field()();
    return state.pending();
  });
  readonly ariaDescribedBy = computed(() => {
    const id = this.fieldDescriptionId();
    return !id || this.ariaInvalid() ? null : id;
  });
  readonly ariaErrorMessage = computed(() => {
    const id = this.fieldDescriptionId();
    return !id || !this.ariaInvalid() ? null : id;
  });
}
