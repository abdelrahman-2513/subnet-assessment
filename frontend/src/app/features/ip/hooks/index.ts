import {
  injectQuery,
  injectMutation,
  QueryClient
} from '@tanstack/angular-query-experimental';
import { IpService } from '../services/ip.service';
import { inject, runInInjectionContext, Injector } from '@angular/core';
import { CreateIpDto, UpdateIpDto } from '../interfaces';
import { Ip, PaginatedResponse } from '../../../shared/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';


export function useIps(subnetId: number, page: number, pageSize: number) {
  const ipService = inject(IpService);
  return injectQuery<PaginatedResponse<Ip>>(() => ({
    queryKey: ['ips', subnetId, page, pageSize],
    queryFn: () => ipService.getIps(subnetId, page, pageSize),
  }));
}

export function useIpsWithInjector(injector: Injector, subnetId: number, page: number, pageSize: number) {
  return runInInjectionContext(injector, () => useIps(subnetId, page, pageSize));
}

export function createIpsQueryFactory(injector: Injector) {
  const ipService = runInInjectionContext(injector, () => inject(IpService));
  
  return (subnetId: number, page: number, pageSize: number) => {
    return runInInjectionContext(injector, () => {
      return injectQuery<PaginatedResponse<Ip>>(() => ({
        queryKey: ['ips', subnetId, page, pageSize],
        queryFn: () => ipService.getIps(subnetId, page, pageSize),
      }));
    });
  };
}

export function useCreateIp() {
  const ipService = inject(IpService);
  const snack = inject(MatSnackBar);
  const queryClient = inject(QueryClient);

  return injectMutation(() => ({
    mutationFn: (dto: CreateIpDto) => ipService.createIp(dto),

    onSuccess: () => {
      snack.open('IP created successfully!', 'Close', { duration: 3000 });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'ips'
      });
    },

    onError: (err: any) => {
      const errorMessage = err.error?.message || 'Error creating IP';   
      snack.open(errorMessage, 'Close', { duration: 3000 });
    },
  }));
}

export function useUpdateIp() {
  const ipService = inject(IpService);
  const snack = inject(MatSnackBar);
  const queryClient = inject(QueryClient);

  return injectMutation(() => ({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateIpDto }) =>
      ipService.updateIp(id, dto),

    onSuccess: () => {
      snack.open('IP updated successfully!', 'Close', { duration: 3000 });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'ips'
      });
    },

    onError: (err: any) => {
      const errorMessage = err.error?.message || 'Error updating IP'; 
      snack.open(errorMessage, 'Close', { duration: 3000 });
    },
  }));
}

export function useDeleteIp() {
  const ipService = inject(IpService);
  const snack = inject(MatSnackBar);
  const queryClient = inject(QueryClient);

  return injectMutation(() => ({
    mutationFn: (id: number) => ipService.deleteIp(id),

    onSuccess: () => {
      snack.open('IP deleted successfully!', 'Close', { duration: 3000 });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'ips'
      });
    },

    onError: (err: any) => {
      const errorMessage = err.error?.message || 'Error deleting IP'; 
      snack.open(errorMessage, 'Close', { duration: 3000 });
    },
  }));
}
