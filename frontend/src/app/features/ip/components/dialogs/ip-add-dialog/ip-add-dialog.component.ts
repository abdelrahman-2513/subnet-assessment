import { Component, signal, effect, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { useSubnets } from '../../../../subnet/hooks';
import { useCreateIp } from '../../../hooks';
import { CreateIpDto } from '../../../interfaces';

@Component({
  selector: 'app-ip-add-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './ip-add-dialog.component.html',
  styleUrls: ['./ip-add-dialog.component.css']
})
export class IpAddDialogComponent {
  ipForm: FormGroup;
  selectedSubnetId = signal<number | null>(null);
  
  subnetsQuery = useSubnets(1, 1000);
  createIpMutation = useCreateIp();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IpAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subnetId?: number } | null
  ) {
    this.ipForm = this.fb.group({
      subnetId: this.fb.control(data?.subnetId || null, Validators.required),
      ipAddress: this.fb.control('', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)])
    });

    this.selectedSubnetId.set(data?.subnetId || null);

    this.ipForm.get('subnetId')?.valueChanges.subscribe((subnetId: number) => {
      this.selectedSubnetId.set(subnetId);
    });

    effect(() => {
      if (this.createIpMutation.isSuccess()) {
        this.dialogRef.close(true);
      }
    });
  }

  get subnets() {
    return this.subnetsQuery.data()?.data ?? [];
  }

  get isSubnetSelected() {
    return this.selectedSubnetId() !== null;
  }

  get isFormValid() {
    return this.ipForm.valid;
  }

  getSelectedSubnetName() {
    const subnetId = this.data?.subnetId;
    if (subnetId) {
      const subnet = this.subnets.find(s => s.subnetId === subnetId);
      return subnet ? `${subnet.subnetName} (${subnet.subnetAddress})` : 'Unknown Subnet';
    }
    return '';
  }

  onAddIp() {
    if (this.ipForm.valid) {
      const createDto: CreateIpDto = {
        ipAddress: this.ipForm.value.ipAddress,
        subnetId: this.ipForm.value.subnetId
      };
      this.createIpMutation.mutate(createDto);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  isLoading() {
    return this.subnetsQuery.isLoading() || this.createIpMutation.isPending();
  }
}
