import { computed, Directive, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive({
  selector: '[formField]',
  host: {
    '[aria-invalid]': 'ariaInvalid()',
    '[aria-busy]': 'ariaBusy()',
    '[aria-describedby]': 'ariaDescribedBy()',
    '[aria-errormessage]': 'ariaErrorMessage()',
  },
})
export class FieldAriaAttributes<T> {
  readonly formField = input.required<FieldTree<T>>();
  readonly fieldDescriptionId = input<string>();

  readonly ariaInvalid = computed(() => {
    const state = this.formField()();
    return state.touched() && !state.pending() ? state.errors().length > 0 : undefined;
  });
  readonly ariaBusy = computed(() => {
    const state = this.formField()();
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
