import { Injector, inputBinding, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldTree, form, minLength, required } from '@angular/forms/signals';

import { FormError } from './form-error';

describe('FormError', () => {
  const fieldData = signal('');
  let field: FieldTree<string>;
  let component: FormError<FieldTree<string>>;
  let fixture: ComponentFixture<FormError<FieldTree<string>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormError],
    }).compileComponents();

    fieldData.set('');

    field = form(
      fieldData,
      (schemaPath) => {
        required(schemaPath, { message: 'Field is required.' });
        minLength(schemaPath, 3, { message: 'Field must contain at least 3 characters.' })
      },
      { injector: TestBed.inject(Injector) }
    );

    fixture = TestBed.createComponent(FormError<FieldTree<string>>, {
      bindings: [inputBinding('fieldRef', signal(field))],
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display nothing, when field is not touched', () => {
    expect(fixture.nativeElement.textContent).toBe('');
  });

  it('should display nothing, when field has no error', async () => {
    fieldData.set('foo');
    field().markAsTouched();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toBe('');
  });

  it('should display an error message', async () => {
    field().markAsTouched();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Field is required.');
  });
});
