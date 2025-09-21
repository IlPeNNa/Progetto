import { Attiva } from '../dto/attiva.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offerta } from '../dto/offerta.model';

@Injectable({ providedIn: 'root' })
export class OffertaService {
  // Ottieni solo le offerte attivate da un utente
  getAttivazioniByCf(cf: string): Observable<Attiva[]> {
    const params = new HttpParams().set('cf', cf);
    return this.http.get<Attiva[]>('http://localhost:8080/attiva', { params });
  }

  // Ottieni tutte le attivazioni
  getAttivazioni(): Observable<Attiva[]> {
    return this.http.get<Attiva[]>('http://localhost:8080/attiva');
  }

  // Attiva un'offerta per l'utente
  attivaOffertaPerUtente(attiva: Attiva): Observable<Attiva> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Attiva>('http://localhost:8080/attiva', attiva, { headers });
  }

  // Annulla l'attivazione di un'offerta
  annullaAttivazioneOfferta(cf: string, idOfferta: number): Observable<void> {
    const params = new HttpParams().set('cf', cf).set('idOfferta', idOfferta.toString());
    return this.http.delete<void>('http://localhost:8080/attiva', { params });
  }
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
}
