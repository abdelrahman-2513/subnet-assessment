import { Component, Inject, signal, effect, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subnet } from '../../../../../shared/interfaces';
import { useDeleteIp, createIpsQueryFactory } from '../../../../ip/hooks';
import { PaginatedListComponent } from '../../../../../libs/components/paginated-list/paginated-list.component';

@Component({
  selector: 'app-ip-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    PaginatedListComponent
  ],
  templateUrl: './ip-list-dialog.component.html',
  styleUrls: ['./ip-list-dialog.component.css']
})
export class IpListDialogComponent {
  page = signal(1);
  pageSize = signal(10);
  selectedSubnetId = signal<number | null>(null);
  Math = Math;
  
  deleteIpMutation = useDeleteIp();

  ipsQuery = signal<any>(null);
  private injector = inject(Injector);
  private createQuery = createIpsQueryFactory(this.injector);

  constructor(
    public dialogRef: MatDialogRef<IpListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subnet: Subnet }
  ) {
    this.selectedSubnetId.set(data.subnet.subnetId);
    this.initializeQuery();

    effect(() => {
      const page = this.page();
      const subnetId = this.selectedSubnetId();
      if (subnetId) {
        setTimeout(() => this.updateQueryParams(), 0);
      }
    });

    effect(() => {
      if (this.deleteIpMutation.isSuccess()) {
        setTimeout(() => this.refreshIps(), 0);
      }
    });
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


  onDeleteIp(id: number) {
    this.deleteIpMutation.mutate(id);
  }

  initializeQuery() {
    const subnetId = this.selectedSubnetId();
    const page = this.page();
    const pageSize = this.pageSize();
    
    if (subnetId) {
      this.ipsQuery.set(this.createQuery(subnetId, page, pageSize));
    }
  }

  updateQueryParams() {
    const subnetId = this.selectedSubnetId();
    const page = this.page();
    const pageSize = this.pageSize();
    
    if (subnetId) {
      this.ipsQuery.set(this.createQuery(subnetId, page, pageSize));
    }
  }

  refreshIps() {
    this.updateQueryParams();
  }

  isLoading() {
    const query = this.ipsQuery();
    return (query?.isLoading() ?? false) || this.deleteIpMutation.isPending();
  }

  onClose() {
    this.dialogRef.close();
  }
}
