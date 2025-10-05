import { Component, model } from '@angular/core';
import { Control, Field, hidden, schema } from '@angular/forms/signals';

export interface GenderIdentity {
  gender: '' | 'male' | 'female' | 'diverse';
  salutation: string; // e. g. "Mx.", "Dr.", etc.
  pronoun: string; // e. g. "they/them"
}

export const identitySchema = schema<GenderIdentity>((path) => {
  hidden(path.salutation, ({ valueOf }) => {
    return !valueOf(path.gender) || valueOf(path.gender) !== 'diverse';
  });
  hidden(path.pronoun, ({ valueOf }) => {
    return !valueOf(path.gender) || valueOf(path.gender) !== 'diverse';
  });
});

@Component({
  selector: 'app-identity-form',
  imports: [Control],
  templateUrl: './identity-form.html',
  styleUrl: './identity-form.scss',
})
export class IdentityForm {
  readonly identity = model.required<Field<GenderIdentity>>();

  protected maybeUpdateSalutationAndPronoun(event: Event) {
    const gender = (event.target as HTMLSelectElement).value;
    if (gender !== 'diverse') {
      this.identity().salutation().value.set('');
      this.identity().pronoun().value.set('');
    }
  }
}
