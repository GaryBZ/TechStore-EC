import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProducto } from './listar-producto';

describe('ListarProducto', () => {
  let component: ListarProducto;
  let fixture: ComponentFixture<ListarProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
