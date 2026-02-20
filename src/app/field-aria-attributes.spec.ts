import { Component, Injector, signal, viewChild } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FieldTree, form, required } from '@angular/forms/signals';
import { FieldAriaAttributes } from './field-aria-attributes';

@Component({
  template: `<input [formField]="field" [fieldDescriptionId]="descriptionId" />`,
  imports: [FieldAriaAttributes],
})
class TestHostComponent {
  field!: FieldTree<string>;
  descriptionId: string | undefined = undefined;
  directive = viewChild(FieldAriaAttributes);
}

describe('FieldAriaAttributes', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: HTMLInputElement;
  let fieldData: ReturnType<typeof signal<string>>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });

    fieldData = signal('');
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.field = form(
      fieldData,
      (schemaPath) => {
        required(schemaPath, { message: 'Field is required.' });
      },
      { injector: TestBed.inject(Injector) }
    );
    await fixture.whenStable();
    inputEl = fixture.nativeElement.querySelector('input');
  });

  it('should create an instance', () => {
    expect(component.directive()).toBeTruthy();
  });

  describe('ariaInvalid', () => {
    it('should be undefined when not touched', () => {
      expect(inputEl.getAttribute('aria-invalid')).toBeNull();
    });

    it('should be true when touched and has errors', async () => {
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-invalid')).toBe('true');
    });

    it('should be false when touched and no errors', async () => {
      fieldData.set('valid value');
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-invalid')).toBe('false');
    });
  });

  describe('ariaBusy', () => {
    it('should be false when not pending', async () => {
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-busy')).toBe('false');
    });
  });

  describe('ariaDescribedBy', () => {
    it('should be null when no fieldDescriptionId is provided', () => {
      expect(inputEl.getAttribute('aria-describedby')).toBeNull();
    });

    it('should be null when field is invalid (ariaInvalid is true)', async () => {
      component.descriptionId = 'desc-id';
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-describedby')).toBeNull();
    });

    it('should return the id when field is valid and id is provided', async () => {
      fieldData.set('valid value');
      component.descriptionId = 'desc-id';
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-describedby')).toBe('desc-id');
    });

    it('should return the id when field is not touched and id is provided', async () => {
      // Re-create fixture with descriptionId set before first detectChanges
      fieldData = signal('');
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      component.field = form(
        fieldData,
        (schemaPath) => {
          required(schemaPath, { message: 'Field is required.' });
        },
        { injector: TestBed.inject(Injector) }
      );
      component.descriptionId = 'desc-id';
      await fixture.whenStable();
      inputEl = fixture.nativeElement.querySelector('input');
      expect(inputEl.getAttribute('aria-describedby')).toBe('desc-id');
    });
  });

  describe('ariaErrorMessage', () => {
    it('should be null when no fieldDescriptionId is provided', async () => {
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-errormessage')).toBeNull();
    });

    it('should be null when field is valid (ariaInvalid is false)', async () => {
      fieldData.set('valid value');
      component.descriptionId = 'error-id';
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-errormessage')).toBeNull();
    });

    it('should return the id when field is invalid and id is provided', async () => {
      component.descriptionId = 'error-id';
      component.field().markAsTouched();
      await fixture.whenStable();
      expect(inputEl.getAttribute('aria-errormessage')).toBe('error-id');
    });

    it('should be null when field is not touched', async () => {
      // Re-create fixture with descriptionId set before first detectChanges
      fieldData = signal('');
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      component.field = form(
        fieldData,
        (schemaPath) => {
          required(schemaPath, { message: 'Field is required.' });
        },
        { injector: TestBed.inject(Injector) }
      );
      component.descriptionId = 'error-id';
      await fixture.whenStable();
      inputEl = fixture.nativeElement.querySelector('input');
      expect(inputEl.getAttribute('aria-errormessage')).toBeNull();
    });
  });
});
