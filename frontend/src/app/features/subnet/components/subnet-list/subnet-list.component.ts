import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { useSubnets, useDeleteSubnet, useUpdateSubnet, useCreateSubnet, useUploadSubnets } from '../../hooks';
import { PaginatedListComponent } from '../../../../libs/components/paginated-list/paginated-list.component';
import { ToastrService } from 'ngx-toastr';
import { Subnet } from '../../../../shared/interfaces';
import { SubnetEditDialogComponent } from '../dialogs/subnet-edit-dialog/subnet-edit-dialog.component';
import { IpListDialogComponent } from '../dialogs/ip-list-dialog/ip-list-dialog.component';

@Component({
  selector: 'app-subnet-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule, PaginatedListComponent],
  templateUrl: './subnet-list.component.html',
  styleUrls: ['./subnet-list.component.css']
})
export class SubnetListComponent {
  page = signal(1);
  pageSize = signal(10);

  subnetsQuery = useSubnets(this.page(), this.pageSize());
  deleteSubnetMutation = useDeleteSubnet();
  updateSubnetMutation = useUpdateSubnet();
  createSubnetMutation = useCreateSubnet();
  uploadSubnetsMutation = useUploadSubnets();

  constructor(private toastr: ToastrService, private dialog: MatDialog) {
    effect(() => {
      if (this.deleteSubnetMutation.isSuccess()) {
        this.toastr.success('Subnet deleted successfully');
      }
    });
  }

  get subnets() {
    return this.subnetsQuery.data()?.data ?? [];
  }

  get totalCount() {
    return this.subnetsQuery.data()?.totalCount ?? 0;
  }

  get pageNumber() {
    return this.subnetsQuery.data()?.pageNumber ?? 1;
  }

  get currentPageSize() {
    return this.subnetsQuery.data()?.pageSize ?? this.pageSize();
  }

  onPageChange(page: number) {
    this.page.set(page);
  }

  refreshSubnets() {
    this.subnetsQuery.refetch();
  }

  onDelete(id: number) {
    this.deleteSubnetMutation.mutate(id);
    this.refreshSubnets();
  }

  onEdit(subnet: Subnet) {
    const dialogRef = this.dialog.open(SubnetEditDialogComponent, {
      width: '500px',
      data: { subnet }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.updateSubnetMutation.mutate({ id: subnet.subnetId, dto: result });
        this.refreshSubnets();
      }
    });
  }

  onViewIps(subnet: Subnet) {
    this.dialog.open(IpListDialogComponent, {
      width: '800px',
      data: { subnet }
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(SubnetEditDialogComponent, {
      width: '500px',
      data: { subnet: null }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result instanceof FormData) {
          const file = result.get('file') as File;
          const createIps = result.get('createIps') === 'true';
          if (file) {
            this.uploadSubnetsMutation.mutate({ file, createIps });
          }
        } else {
          this.createSubnetMutation.mutate(result);
        }
        this.refreshSubnets();
      }
    });
  }

  isLoading() {
    return this.subnetsQuery.isLoading() || this.deleteSubnetMutation.isPending() || 
           this.updateSubnetMutation.isPending() || this.createSubnetMutation.isPending() ||
           this.uploadSubnetsMutation.isPending();
  }
}
