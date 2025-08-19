import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offerta } from '../dto/offerta.model';

@Injectable({ providedIn: 'root' })
export class OffertaService {
  private apiUrl = 'http://localhost:8080/offerte';

  constructor(private http: HttpClient) {}

  getOfferte(tipo?: string, durataMese?: number, prezzoMax?: number): Observable<Offerta[]> {
    let params = new HttpParams();
    if (tipo) params = params.set('tipo', tipo);
    if (durataMese) params = params.set('durataMese', durataMese);
    if (prezzoMax) params = params.set('prezzoMax', prezzoMax);
    return this.http.get<Offerta[]>(this.apiUrl, { params });
    }

  getOffertaSuggerita(tipo: string, consumoMedio?: number): Observable<Offerta> {
    let params = new HttpParams().set('tipo', tipo);
    if (consumoMedio) params = params.set('consumoMedio', consumoMedio);
    return this.http.get<Offerta>(`${this.apiUrl}/suggerita`, { params });
  }
    attivaOfferta(id: number): Observable<Offerta> {
      return this.http.post<Offerta>(`${this.apiUrl}/${id}/attiva`, {});
    }
}
