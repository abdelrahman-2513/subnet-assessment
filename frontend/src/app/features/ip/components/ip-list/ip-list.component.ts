import { Component, signal, effect, computed, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { useCreateIp, useUpdateIp, useDeleteIp, createIpsQueryFactory } from '../../hooks';
import { useSubnets } from '../../../subnet/hooks';
import { PaginatedListComponent } from '../../../../libs/components/paginated-list/paginated-list.component';
import { ToastrService } from 'ngx-toastr';
import { Ip } from '../../../../shared/interfaces';
import { IpEditDialogComponent } from '../dialogs/ip-edit-dialog/ip-edit-dialog.component';
import { IpAddDialogComponent } from '../dialogs/ip-add-dialog/ip-add-dialog.component';

@Component({
  selector: 'app-ip-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule, 
    MatProgressSpinnerModule, 
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    PaginatedListComponent
  ],
  templateUrl: './ip-list.component.html',
  styleUrls: ['./ip-list.component.css']
})
export class IpListComponent {
  page = signal(1);
  pageSize = signal(10);
  selectedSubnetId = signal<number | null>(null);
  Math = Math;

  subnetForm: FormGroup;
  subnetsQuery = useSubnets(1, 1000);
  ipsQuery = signal<any>(null);
  createIpMutation = useCreateIp();
  updateIpMutation = useUpdateIp();
  deleteIpMutation = useDeleteIp();
  private injector = inject(Injector);
  private createQuery = createIpsQueryFactory(this.injector);

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService, 
    private dialog: MatDialog
  ) {
    this.subnetForm = this.fb.group({
      subnetId: this.fb.control(null, Validators.required)
    });

    this.subnetForm.get('subnetId')?.valueChanges.subscribe((subnetId: number) => {
      this.selectedSubnetId.set(subnetId);
      this.page.set(1);
      this.updateIpsQuery();
    });

    effect(() => {
      const page = this.page();
      const subnetId = this.selectedSubnetId();
      if (subnetId) {
        setTimeout(() => this.updateIpsQuery(), 0);
      }
    });

    effect(() => {
      if (this.createIpMutation.isSuccess()) {
        this.toastr.success('IP created successfully');
      }
      if (this.updateIpMutation.isSuccess()) {
        this.toastr.success('IP updated successfully');
      }
      if (this.deleteIpMutation.isSuccess()) {
        this.toastr.success('IP deleted successfully');
      }
    });
  }

  get subnets() {
    return this.subnetsQuery.data()?.data ?? [];
  }

  get ips() {
    const query = this.ipsQuery();
    return query?.data()?.data ?? [];
  }

  get totalCount() {
    const query = this.ipsQuery();
    return query?.data()?.totalCount ?? 0;
  }

  get pageNumber() {
    const query = this.ipsQuery();
    return query?.data()?.pageNumber ?? 1;
  }

  get currentPageSize() {
    const query = this.ipsQuery();
    return query?.data()?.pageSize ?? this.pageSize();
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  onAddIp() {
    const dialogRef = this.dialog.open(IpAddDialogComponent, {
      width: '500px',
      data: { subnetId: this.selectedSubnetId() }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.refreshIps();
      }
    });
  }

  onEditIp(ip: Ip) {
    const dialogRef = this.dialog.open(IpEditDialogComponent, {
      width: '400px',
      data: { ip, subnetId: this.selectedSubnetId() }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.updateIpMutation.mutate({ id: ip.ipId, dto: result });
      }
    });
  }

  onDeleteIp(id: number) {
    this.deleteIpMutation.mutate(id);
  }

  updateIpsQuery() {
    const subnetId = this.selectedSubnetId();
    const page = this.page();
    const pageSize = this.pageSize();
    console.log(subnetId, page, pageSize);
    if (subnetId) {
      this.ipsQuery.set(this.createQuery(subnetId, page, pageSize));
    } else {
      this.ipsQuery.set(null);
    }
  }

  refreshIps() {
    this.updateIpsQuery();
  }

  isLoading() {
    const query = this.ipsQuery();
    return (query?.isLoading() ?? false) || this.createIpMutation.isPending() || 
           this.updateIpMutation.isPending() || this.deleteIpMutation.isPending();
  }
}
