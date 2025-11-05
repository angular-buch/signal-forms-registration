import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { FIELD_INFO } from './form-props';

@Directive({
  selector: '[fieldInfo]',
  standalone: true,
})
export class FieldInfo {
  readonly fieldInfo = input.required<FieldTree<unknown>>();
  readonly #templateRef = inject(TemplateRef<{ $implicit: string; cssClass: string }>);
  readonly #viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const field = this.fieldInfo()();
      this.#viewContainer.clear();

      let messages: { info: string; cssClass: 'info' | 'invalid' }[] = [];

      if (field.pending()) {
        messages = [{ info: 'Checking availability ...', cssClass: 'info' }];
      } else if (field.touched() && field.errors().length > 0) {
        messages = field.errors().map((e) => ({ info: e.message || 'Invalid', cssClass: 'info' }));
      } else if (field.hasMetadata(FIELD_INFO)) {
        messages = [{ info: field.metadata(FIELD_INFO)!, cssClass: 'info' }];
      }

      messages.forEach((message) => {
        this.#viewContainer.createEmbeddedView(this.#templateRef, {
          $implicit: message.info,
          cssClass: message.cssClass,
        });
      });
    });
  }
}
