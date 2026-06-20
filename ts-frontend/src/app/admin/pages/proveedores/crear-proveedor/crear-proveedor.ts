import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProveedorModel } from '../../../../core/models/proveedor.model';
import { ProveedorService } from '../../../../core/services/proveedor.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-proveedor',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-proveedor.html',
  styleUrl: './crear-proveedor.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CrearProveedor implements OnInit {
  isEdit = false;
  proveedorId: number | null = null;
  saving = false;

  form: Partial<ProveedorModel> = {
    pro_emp: '',
    pro_ruc: '',
    pro_con: '',
    pro_tel: '',
    pro_cor: '',
    pro_dir: '',
    pro_est: 'A',
  };

  errors: any = {};

  constructor(
    private proveedorService: ProveedorService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.proveedorId = Number(id);
        this.loadProveedor(this.proveedorId);
      } else {
        this.isEdit = false;
        this.proveedorId = null;
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.form = {
      pro_emp: '',
      pro_ruc: '',
      pro_con: '',
      pro_tel: '',
      pro_cor: '',
      pro_dir: '',
      pro_est: 'A',
    };
  }

  loadProveedor(id: number): void {
    this.proveedorService.getById(id).subscribe({
      next: (data) => {
        if (data) this.form = { ...data };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando proveedor', err),
    });
  }

  toggleEst(): void {
    this.form.pro_est = this.form.pro_est === 'A' ? 'I' : 'A';
  }

  clearErr(field: string): void {
    delete this.errors[field];
  }

  validate(): boolean {
    this.errors = {};
    if (!this.form.pro_emp?.trim()) this.errors.pro_emp = true;
    return Object.keys(this.errors).length === 0;
  }

  guardar(): void {
    if (!this.validate()) {
      this.showToast('Revisa los campos marcados');
      return;
    }

    this.saving = true;
    const payload = {
      pro_emp: this.form.pro_emp,
      pro_ruc: this.form.pro_ruc || null,
      pro_con: this.form.pro_con || null,
      pro_tel: this.form.pro_tel || null,
      pro_cor: this.form.pro_cor || null,
      pro_dir: this.form.pro_dir || null,
      pro_est: this.form.pro_est,
    };

    const obs = this.isEdit
      ? this.proveedorService.update(this.proveedorId!, payload)
      : this.proveedorService.create(payload as Omit<ProveedorModel, 'pro_id'>);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showToast(this.isEdit ? 'Proveedor actualizado' : 'Proveedor creado');
        setTimeout(() => this.goBack(), 800);
      },
      error: (err) => {
        this.saving = false;
        alert(err.error?.message || 'Error al guardar');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/proveedores']);
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