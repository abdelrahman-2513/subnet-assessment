import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subnet } from '../../../../../shared/interfaces';
import { CreateSubnetDto } from '../../../interfaces';

@Component({
  selector: 'app-subnet-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './subnet-edit-dialog.component.html',
  styleUrls: ['./subnet-edit-dialog.component.css']
})
export class SubnetEditDialogComponent {
  subnetForm: FormGroup;
  fileForm: FormGroup;
  selectedFile: File | null = null;
  isEditMode: boolean;
  selectedTabIndex = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SubnetEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { subnet: Subnet | null }
  ) {
    this.isEditMode = !!data.subnet;
    console.log('isEditMode set to:', this.isEditMode);
    
    this.subnetForm = this.fb.group({
      subnetName: this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      subnetAddress: this.fb.control('', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/)]),
      createIps: this.fb.control(false)
    });

    this.fileForm = this.fb.group({
      createIps: this.fb.control(false)
    });

    if (this.isEditMode && data.subnet) {
      this.subnetForm.patchValue({
        subnetName: data.subnet.subnetName,
        subnetAddress: data.subnet.subnetAddress,
        createIps: false
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSave() {
    if (this.isEditMode) {
      if (this.subnetForm.valid) this.dialogRef.close(this.subnetForm.value as CreateSubnetDto);
    } else {
      if (this.selectedTabIndex === 0) this.onSaveManual();
      else this.onSaveFile();
    }
  }

  onSaveManual() {
    if (this.subnetForm.valid) this.dialogRef.close(this.subnetForm.value as CreateSubnetDto);
  }

  onSaveFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('createIps', (this.fileForm.get('createIps')?.value || false).toString());
      this.dialogRef.close(formData);
    }
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  getSaveButtonDisabled(): boolean {
    if (this.isEditMode) return !this.subnetForm.valid;
    if (this.selectedTabIndex === 0) return !this.subnetForm.valid;
    return !this.selectedFile;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
