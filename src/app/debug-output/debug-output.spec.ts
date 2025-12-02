import { Injector, inputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldTree, form } from '@angular/forms/signals';

import { DebugOutput } from './debug-output';

describe('DebugOutput', () => {
  const formData = {
    foo: 'bar',
    baz: 42,
  };
  let component: DebugOutput<FieldTree<typeof formData>>;
  let fixture: ComponentFixture<DebugOutput<FieldTree<typeof formData>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugOutput],
    }).compileComponents();

    const f = form(signal(formData), { injector: TestBed.inject(Injector) });

    fixture = TestBed.createComponent(DebugOutput<FieldTree<typeof formData>>, {
      bindings: [inputBinding('form', signal(f))],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
