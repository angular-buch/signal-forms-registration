import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationForm1 } from './registration-form-1';

describe('RegistrationForm1', () => {
  let component: RegistrationForm1;
  let fixture: ComponentFixture<RegistrationForm1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm1],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
