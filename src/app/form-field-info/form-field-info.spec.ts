import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldInfo } from './form-field-info';

describe('FormFieldInfo', () => {
  let component: FormFieldInfo;
  let fixture: ComponentFixture<FormFieldInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
