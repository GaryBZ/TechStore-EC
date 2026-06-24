import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProducts } from './listar-products';

describe('ListarProducts', () => {
  let component: ListarProducts;
  let fixture: ComponentFixture<ListarProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
