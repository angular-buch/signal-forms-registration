import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityForm, GenderIdentity } from './identity-form';
import { Injector, inputBinding, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

describe('IdentityForm', () => {
  const identityData: GenderIdentity = {
    gender: '',
    salutation: '',
    pronoun: '',
  };
  let component: IdentityForm;
  let fixture: ComponentFixture<IdentityForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentityForm],
    }).compileComponents();

    const identityFormModel = form(signal(identityData), { injector: TestBed.inject(Injector) });

    fixture = TestBed.createComponent(IdentityForm, {
      bindings: [inputBinding('identity', signal(identityFormModel))],
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
