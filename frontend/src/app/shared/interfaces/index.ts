export interface Subnet {
  subnetId: number;
  subnetName: string;
  subnetAddress: string;
  createdBy?: number;
  createdAt?: string;
}

export interface Ip {
  ipId: number;
  ipAddress: string;
  subnetId: number;
  createdBy?: number;
  createdAt?: string;
}

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}