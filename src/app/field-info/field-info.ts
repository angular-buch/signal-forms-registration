import { Component, computed, input } from '@angular/core';
import { FieldTree, MAX_LENGTH, MIN, MIN_LENGTH, REQUIRED } from '@angular/forms/signals';
import { MIN_ONE_IN_LIST } from '../form-props';

@Component({
  selector: 'app-field-info',
  imports: [],
  templateUrl: './field-info.html',
  styleUrl: './field-info.scss'
})
export class FieldInfo<T> {
  readonly fieldRef = input.required<FieldTree<T>>();
  protected readonly isFieldRequired = computed(() => this.fieldRef()().property(REQUIRED)());
  private readonly fieldMinLength = computed(() => this.fieldRef()().property(MIN_LENGTH)());
  private readonly fieldMaxLength = computed(() => this.fieldRef()().property(MAX_LENGTH)());
  protected readonly fieldRange = computed(() => !!this.fieldMinLength() && !!this.fieldMaxLength() && `${this.fieldMinLength()}..${this.fieldMaxLength()}`);
  protected readonly fieldMin = computed(() => this.fieldRef()().property(MIN)());
  protected readonly isValidationPending = computed(() => this.fieldRef()().pending());
  protected readonly fieldOneInList = computed(() => this.fieldRef()().property(MIN_ONE_IN_LIST));
  protected readonly hasSpecificInfo = computed(() => this.fieldMin() || this.fieldOneInList() || this.fieldRange() || this.isValidationPending());
}
