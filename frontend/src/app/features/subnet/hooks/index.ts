import {
    injectQuery,
    injectMutation,
    QueryClient
} from '@tanstack/angular-query-experimental';
import { SubnetService } from '../services/subnet.service';
import { inject } from '@angular/core';
import { CreateSubnetDto, FileUploadDto } from '../interfaces';
import { PaginatedResponse, Subnet } from '../../../shared/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

export function useSubnets(page: number, pageSize: number) {
    const subnetService = inject(SubnetService);
    return injectQuery<PaginatedResponse<Subnet>>(() => ({
        queryKey: ['subnets', page, pageSize],
        queryFn: () => subnetService.getSubnets(page, pageSize),
    }));
}

export function useCreateSubnet() {
    const subnetService = inject(SubnetService);
    const snack = inject(MatSnackBar);
    const queryClient = inject(QueryClient);

    return injectMutation(() => (
        {
            mutationFn: (dto: CreateSubnetDto) => subnetService.createSubnet(dto),

        onSuccess: (result: any) => {
              const successMessage = result.message || 'Subnet created successfully!';
                snack.open(successMessage, 'Close', { duration: 3000 });
                queryClient.invalidateQueries({
                  predicate: (query) => query.queryKey[0] === 'subnets'
                });
            },
        onError: (err: any) => {
              const errorMessage = err.error?.message || 'Error creating subnet'; //TODO: add error message from backend to frontend
              snack.open(errorMessage, 'Close', { duration: 3000 });
            }
        })
    );
}

export function useUpdateSubnet() {
  const subnetService = inject(SubnetService);
  const snack = inject(MatSnackBar);
  const queryClient = inject(QueryClient);

  return injectMutation(() => ({
    mutationFn: ({ id, dto }: { id: number; dto: CreateSubnetDto }) =>
      subnetService.updateSubnet(id, dto),

    onSuccess: () => {
      snack.open('Subnet updated successfully!', 'Close', { duration: 3000 });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'subnets'
      });
    },

    onError: (err: any) => {
      const errorMessage = err.error?.message || 'Error updating subnet'; 
      snack.open(errorMessage, 'Close', { duration: 3000 });
    },
  }));
}

export function useDeleteSubnet() {
  const subnetService = inject(SubnetService);
  const snack = inject(MatSnackBar);
  const queryClient = inject(QueryClient);

  return injectMutation(() => ({
    mutationFn: (id: number) => subnetService.deleteSubnet(id),

    onSuccess: () => {
      snack.open('Subnet deleted successfully!', 'Close', { duration: 3000 });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'subnets'
      });
    },

    onError: (err: any) => {
      const errorMessage = err.error?.message || 'Error deleting subnet'; 
      snack.open(errorMessage, 'Close', { duration: 3000 });
    },
  }));
}

export function useUploadSubnets() {
  const subnetService = inject(SubnetService);
  const snack = inject(MatSnackBar);
  const queryClient = inject(QueryClient);

  return injectMutation(() => ({
    mutationFn: (dto: FileUploadDto) => 
      subnetService.uploadSubnetsFromFile(dto.file, dto.createIps || false),

    onSuccess: (result: any) => {
      snack.open(result.message || 'Subnets uploaded successfully!', 'Close', { duration: 5000 });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'subnets'
      });
    },

    onError: (error: any) => {
      const errorMessage = error.error?.message || 'Error uploading subnets'; 
      snack.open(errorMessage, 'Close', { duration: 3000 });
    },
  }));
}
