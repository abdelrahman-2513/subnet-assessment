import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { PaginatedResponse } from '../../../shared/interfaces';
import { firstValueFrom } from 'rxjs';
import { CreateIpDto, UpdateIpDto } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  constructor(private api: ApiService) {}

  getIps(subnetId: number, page: number, pageSize: number): Promise<PaginatedResponse<any>> {
    return firstValueFrom(this.api.get(`ip/list?subnetId=${subnetId}&page=${page}&pageSize=${pageSize}`));
  }

  createIp(dto: CreateIpDto): Promise<any> {
    return firstValueFrom(this.api.post('ip', dto));
  }

  updateIp(id: number, dto: UpdateIpDto): Promise<any> {
    return firstValueFrom(this.api.patch(`ip/${id}`, dto));
  }

  deleteIp(id: number): Promise<any> {
    return firstValueFrom(this.api.delete(`ip/${id}`));
  }
}
