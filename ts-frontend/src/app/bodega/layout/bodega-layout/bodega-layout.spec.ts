import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodegaLayout } from './bodega-layout';

describe('BodegaLayout', () => {
  let component: BodegaLayout;
  let fixture: ComponentFixture<BodegaLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodegaLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(BodegaLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
