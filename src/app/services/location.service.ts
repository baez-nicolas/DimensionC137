import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Location } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/location';

  getAll(page: number = 1): Observable<ApiResponse<Location>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<Location>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`);
  }

  getMultiple(ids: number[]): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/${ids.join(',')}`);
  }

  filter(filters: {
    name?: string;
    type?: string;
    dimension?: string;
    page?: number;
  }): Observable<ApiResponse<Location>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<Location>>(this.apiUrl, { params });
  }
}
