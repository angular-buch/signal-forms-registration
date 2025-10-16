import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInfo } from './field-info';

describe('FieldInfo', () => {
  let component: FieldInfo;
  let fixture: ComponentFixture<FieldInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
