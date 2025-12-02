import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButton } from './back-button';
import { provideRouter } from '@angular/router';

describe('BackButton', () => {
  let component: BackButton;
  let fixture: ComponentFixture<BackButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButton],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
