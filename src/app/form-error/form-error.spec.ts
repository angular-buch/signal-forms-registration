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
        required(schemaPath, { message: 'field is required' });
        minLength(schemaPath, 3, { message: 'field must contain at least 3 characters' })
      },
      { injector: TestBed.inject(Injector) }
    );

    fixture = TestBed.createComponent(FormError<FieldTree<string>>, {
      bindings: [inputBinding('fieldRef', signal(field))],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display nothing, when field is not touched', () => {
    expect(fixture.nativeElement.textContent).toEqual('');
  });

  it('should display nothing, when field has no error', () => {
    fieldData.set('foo');
    field().markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toEqual('');
  });

  it('should display an error message', () => {
    field().markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('field is required');
  });
});
