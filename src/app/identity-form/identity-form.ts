import { Component, input } from '@angular/core';
import { Field, FieldTree, hidden, required, schema } from '@angular/forms/signals';

import { FormError } from '../form-error/form-error';

export interface GenderIdentity {
  gender: '' | 'male' | 'female' | 'diverse';
  salutation: string; // e. g. "Mx.", "Dr.", etc.
  pronoun: string; // e. g. "they/them"
}

export const initialGenderIdentityState: GenderIdentity = {
  gender: '',
  salutation: '',
  pronoun: '',
};

export const identitySchema = schema<GenderIdentity>((path) => {
  hidden(path.salutation, (ctx) => {
    return !ctx.valueOf(path.gender) || ctx.valueOf(path.gender) !== 'diverse';
  });
  hidden(path.pronoun, (ctx) => {
    return !ctx.valueOf(path.gender) || ctx.valueOf(path.gender) !== 'diverse';
  });

  required(path.salutation, {
    when: (ctx) => ctx.valueOf(path.gender) === 'diverse',
    message: 'Please choose a salutation, when diverse gender selected',
  });
  required(path.pronoun, {
    when: (ctx) => ctx.valueOf(path.gender) === 'diverse',
    message: 'Please choose a pronoun, when diverse gender selected',
  });
});

@Component({
  selector: 'app-identity-form',
  imports: [Field, FormError],
  templateUrl: './identity-form.html',
  styleUrl: './identity-form.scss',
})
export class IdentityForm {
  readonly identity = input.required<FieldTree<GenderIdentity>>();

  protected updateSalutationAndPronoun() {
    this.identity().salutation().value.set('');
    this.identity().salutation().reset();
    this.identity().pronoun().value.set('');
    this.identity().pronoun().reset();
  }
}
