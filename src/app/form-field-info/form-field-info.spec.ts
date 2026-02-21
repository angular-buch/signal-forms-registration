import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';

import { FormFieldInfo } from './form-field-info';

@Component({
  selector: 'app-test-host',
  imports: [FormFieldInfo],
  template: `<app-form-field-info [fieldRef]="testForm.value" />`,
})
class TestHostComponent {
  readonly model = signal({ value: '' });
  readonly testForm = form(this.model, schema<{ value: string }>(() => {}));
}

describe('FormFieldInfo', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    const formFieldInfo = fixture.nativeElement.querySelector('app-form-field-info');
    expect(formFieldInfo).toBeTruthy();
  });
});
