import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateIpDto, UpdateIpDto } from '../../../interfaces';

@Component({
  selector: 'app-ip-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './ip-edit-dialog.component.html',
  styleUrls: ['./ip-edit-dialog.component.css']
})
export class IpEditDialogComponent {
  ipForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<IpEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ip: any | null, subnetId: number }
  ) {
    this.isEditMode = !!data.ip;
    
    this.ipForm = this.fb.group({
      ipAddress: this.fb.control('', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]),
      subnetId: this.fb.control(data.subnetId, Validators.required)
    });

    if (this.isEditMode && data.ip) {
      this.ipForm.patchValue({
        ipAddress: data.ip.ipAddress,
        subnetId: data.ip.subnetId
      });
    }
  }

  onSave() {
    if (this.ipForm.valid) {
      if (this.isEditMode) {
        const updateDto: UpdateIpDto = {
          ipAddress: this.ipForm.value.ipAddress
        };
        this.dialogRef.close(updateDto);
      } else {
        const createDto: CreateIpDto = {
          ipAddress: this.ipForm.value.ipAddress,
          subnetId: this.ipForm.value.subnetId
        };
        this.dialogRef.close(createDto);
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
