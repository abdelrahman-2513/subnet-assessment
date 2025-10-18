import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { CreateSubnetDto, FileUploadDto } from '../interfaces';
import { PaginatedResponse, Subnet } from '../../../shared/interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubnetService {
  constructor(private api: ApiService) {}

  getSubnets(page: number, pageSize: number): Promise<PaginatedResponse<Subnet>> {
    return firstValueFrom(this.api.get(`subnet/list?page=${page}&pageSize=${pageSize}`));
  }

  createSubnet(dto: CreateSubnetDto): Promise<any> {
    return firstValueFrom(this.api.post('subnet', dto));
  }

  updateSubnet(id: number, dto: CreateSubnetDto): Promise<any> {
    return firstValueFrom(this.api.patch(`subnet/${id}`, dto));
  }

  deleteSubnet(id: number): Promise<any> {
    return firstValueFrom(this.api.delete(`subnet/${id}`));
  }

  uploadSubnetsFromFile(file: File, createIps: boolean = false): Promise<any> {
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('createIps', createIps.toString());
    
    return firstValueFrom(this.api.post('subnet/upload', formData));
  }
}
