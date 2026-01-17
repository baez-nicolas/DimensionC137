import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Character } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';

  getAll(page: number = 1): Observable<ApiResponse<Character>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<Character>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  getMultiple(ids: number[]): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.apiUrl}/${ids.join(',')}`);
  }

  filter(filters: {
    name?: string;
    status?: string;
    species?: string;
    type?: string;
    gender?: string;
    page?: number;
  }): Observable<ApiResponse<Character>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<Character>>(this.apiUrl, { params });
  }
}
