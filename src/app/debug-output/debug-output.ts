import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-debug-output',
  imports: [JsonPipe],
  templateUrl: './debug-output.html',
  styleUrl: './debug-output.scss'
})
export class DebugOutput<T> {
  readonly form = input.required<FieldTree<T>>();
}
