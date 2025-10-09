import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugOutput } from './debug-output';

describe('DebugOutput', () => {
  let component: DebugOutput;
  let fixture: ComponentFixture<DebugOutput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugOutput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugOutput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
