import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProveedor } from './listar-proveedor';

describe('ListarProveedor', () => {
  let component: ListarProveedor;
  let fixture: ComponentFixture<ListarProveedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProveedor],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarProveedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
