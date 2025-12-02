import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Multiselect } from './multiselect';
import { inputBinding, signal } from '@angular/core';

describe('Multiselect', () => {
  let component: Multiselect;
  let fixture: ComponentFixture<Multiselect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Multiselect],
    }).compileComponents();

    fixture = TestBed.createComponent(Multiselect, { bindings: [
      inputBinding('label', signal('my label')),
      inputBinding('selectOptions', signal(['foo', 'bar', 'baz']))
    ]});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
