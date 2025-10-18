import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string, params?: Record<string, any>) {
    const httpParams = new HttpParams({ fromObject: params || {} });
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  patch<T>(endpoint: string, body: any) {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
    }
    
  upload<T>(endpoint: string, file: File, extraData?: any) {
    const formData = new FormData();
    formData.append('file', file);
    if (extraData) {
      Object.keys(extraData).forEach(key => formData.append(key, extraData[key]));
    }
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData);
  }
}
