import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = '/api/salary';

  constructor(private http: HttpClient) {}

  getStipendioNetto(codiceFiscale: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${codiceFiscale}/netto`);
  }
}
