import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Episode } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/episode';

  getAll(page: number = 1): Observable<ApiResponse<Episode>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<Episode>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/${id}`);
  }

  getMultiple(ids: number[]): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/${ids.join(',')}`);
  }

  filter(filters: {
    name?: string;
    episode?: string;
    page?: number;
  }): Observable<ApiResponse<Episode>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<Episode>>(this.apiUrl, { params });
  }
}
