import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoCheckout } from './carrito-checkout';

describe('CarritoCheckout', () => {
  let component: CarritoCheckout;
  let fixture: ComponentFixture<CarritoCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoCheckout],
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoCheckout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
