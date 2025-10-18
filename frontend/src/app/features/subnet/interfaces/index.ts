export interface CreateSubnetDto {
  subnetName: string;
  subnetAddress: string;
  createIps?: boolean;
}
export interface UpdateSubnetDto {
  subnetName: string;
  subnetAddress: string;
}

export interface FileUploadDto {
  file: File;
  createIps?: boolean;
}
