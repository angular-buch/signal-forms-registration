import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { extractValue } from '@angular/forms/signals/compat';

@Component({
  selector: 'app-debug-output',
  imports: [JsonPipe],
  templateUrl: './debug-output.html',
  styleUrl: './debug-output.scss'
})
export class DebugOutput<T> {
  readonly form = input.required<FieldTree<T>>();

  protected readonly valueJson = computed(() => {
    return extractValue(this.form());
  });
}
