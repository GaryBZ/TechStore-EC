import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../../core/services/producto.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { MarcaService } from '../../../../core/services/marca.service';
import { ProveedorService } from '../../../../core/services/proveedor.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProveedorModel } from '../../../../core/models/proveedor.model';
import { MarcaModel } from '../../../../core/models/marca.model';
import { CategoriaModel } from '../../../../core/models/categoria.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoModel } from '../../../../core/models/tipo.model';
import { TipoService } from '../../../../core/services/tipo.service';

@Component({
  selector: 'app-crear-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-producto.html',
  styleUrl: './crear-producto.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CrearProducto implements OnInit {
  isEdit = false;
  productId: number | null = null;
  saving = false;

  categorias: CategoriaModel[] = [];
  marcas: MarcaModel[] = [];
  proveedores: ProveedorModel[] = [];
  tipos: TipoModel[] = [];

  form: any = {
    prd_nom: '',
    prd_des: '',
    cat_id: '',
    mar_id: '',
    pro_id: '',
    tip_id: '',
    prd_sku: '',
    pro_img: '',
    prd_pre_com: null,
    prd_pre_ven: null,
    prd_stk_min: 5,
    prd_est: 'A',
  };

  resetForm(): void {
    this.form = {
      prd_nom: '',
      prd_des: '',
      cat_id: '',
      mar_id: '',
      pro_id: '',
      tip_id: '',
      prd_sku: '',
      pro_img: '',
      prd_pre_com: null,
      prd_pre_ven: null,
      prd_stk_min: 5,
      prd_est: 'A',
    };
  }

  errors: any = {};

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private marcaService: MarcaService,
    private proveedorService: ProveedorService,
    private tipoService: TipoService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadMarcas();
    this.loadProveedores();
    this.loadTipos();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      console.log('Param id recibido:', id);
      if (id) {
        this.isEdit = true;
        this.productId = Number(id);
        console.log('Cargando producto con id:', this.productId);
        this.loadProducto(this.productId);
      } else {
        console.log('No hay id, modo crear');
        this.isEdit = false;
        this.productId = null;
        this.resetForm();
      }
    });
  }
  loadCategorias(): void {
    this.categoriaService.getAll().subscribe({ next: (data) => (this.categorias = data) });
  }

  loadMarcas(): void {
    this.marcaService.getAll().subscribe({ next: (data) => (this.marcas = data) });
  }

  loadProveedores(): void {
    this.proveedorService.getAll().subscribe({ next: (data) => (this.proveedores = data) });
  }

  loadTipos(): void {
    this.tipoService.getAll().subscribe({ next: (data) => (this.tipos = data) });
  }

  loadProducto(id: number): void {
    this.productoService.getById(id).subscribe({
      next: (data) => {
        if (data) this.form = { ...data };
        this.cdr.detectChanges(); // <- agregar esto
      },
      error: (err) => console.error('Error cargando producto', err),
    });
  }

  get margen(): number {
    const com = Number(this.form.prd_pre_com) || 0;
    const ven = Number(this.form.prd_pre_ven) || 0;
    if (com === 0) return 0;
    return ((ven - com) / com) * 100;
  }

  get margenLabel(): string {
    if (!this.form.prd_pre_com || !this.form.prd_pre_ven) return '—';
    return this.margen.toFixed(1) + '%';
  }

  autoSku(): void {
    const cat = this.categorias.find((c) => c.cat_id === Number(this.form.cat_id));
    const mar = this.marcas.find((m) => m.mar_id === Number(this.form.mar_id));
    const nomPart = (this.form.prd_nom || '').substring(0, 4).toUpperCase().replace(/\s/g, '');
    const catPart = cat ? cat.cat_nom.substring(0, 3).toUpperCase() : 'GEN';
    const marPart = mar ? mar.mar_nom.substring(0, 3).toUpperCase() : 'XXX';
    const rand = Math.floor(Math.random() * 900 + 100);
    this.form.prd_sku = `${catPart}-${marPart}-${nomPart}-${rand}`;
  }

  regenSku(): void {
    this.autoSku();
  }

  toggleEst(): void {
    this.form.prd_est = this.form.prd_est === 'A' ? 'I' : 'A';
  }

  clearErr(field: string): void {
    delete this.errors[field];
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.prd_nom?.trim()) this.errors.prd_nom = true;
    if (!this.form.cat_id) this.errors.cat_id = true;
    if (!this.form.mar_id) this.errors.mar_id = true;
    if (!this.form.pro_id) this.errors.pro_id = true;
    if (!this.form.tip_id) this.errors.tip_id = true;
    if (!this.form.prd_pre_com || this.form.prd_pre_com <= 0) this.errors.prd_pre_com = true;
    if (!this.form.prd_pre_ven || this.form.prd_pre_ven <= 0) this.errors.prd_pre_ven = true;
    return Object.keys(this.errors).length === 0;
  }

  guardar(): void {
    if (!this.validate()) {
      this.showToast('Revisa los campos marcados');
      return;
    }

    this.saving = true;
    const payload = {
      cat_id: Number(this.form.cat_id),
      pro_id: Number(this.form.pro_id),
      mar_id: Number(this.form.mar_id),
      tip_id: Number(this.form.tip_id),
      prd_nom: this.form.prd_nom,
      prd_des: this.form.prd_des || null,
      prd_sku: this.form.prd_sku,
      pro_img: this.form.pro_img || null,
      prd_pre_com: Number(this.form.prd_pre_com),
      prd_pre_ven: Number(this.form.prd_pre_ven),
      prd_stk_min: Number(this.form.prd_stk_min) || 0,
      prd_est: this.form.prd_est,
    };

    const obs = this.isEdit
      ? this.productoService.update(this.productId!, payload)
      : this.productoService.create(payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showToast(this.isEdit ? 'Producto actualizado' : 'Producto creado');
        setTimeout(() => this.goBack(), 800);
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message || 'Error al guardar');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/productos']);
  }

  showToast(msg: string): void {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }
}
