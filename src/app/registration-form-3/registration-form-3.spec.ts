import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationForm3 } from './registration-form-3';

describe('RegistrationForm3', () => {
  let component: RegistrationForm3;
  let fixture: ComponentFixture<RegistrationForm3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm3],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
