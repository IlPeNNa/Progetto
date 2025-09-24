import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bolletta, StatisticheCliente, TipoBolletta } from '../dto/bolletta.model';

@Injectable({providedIn: 'root'})
export class BollettaService {
  private apiUrl = '/api/bollette';

  constructor(private http: HttpClient) {}

  // Ottieni tutte le bollette dall'utente corrente
  getAll(): Observable<Bolletta[]> {
    // Prendi l'utente corrente dalla localStorage per ottenere il CF
    const currentUser = localStorage.getItem('utente'); // Correzione: chiave corretta
    if (!currentUser) {
      return of([]);
    }
    
    const user = JSON.parse(currentUser);
    const cf = user.cf;
    
    if (!cf) {
      return of([]);
    }
    
    // Chiamata al backend per ottenere le bollette dell'utente
    return this.http.get<any[]>(`${this.apiUrl}/utente/${cf}`).pipe(
      map(bollette => bollette.map(b => this.mapBackendToFrontend(b)))
    );
  }

  // Mappa i dati dal formato backend a quello frontend
  private mapBackendToFrontend(backendBolletta: any): Bolletta {
    return {
      // Proprietà backend
      idBolletta: backendBolletta.idBolletta,
      scadenza: new Date(backendBolletta.scadenza),
      importo: backendBolletta.importo,
      tipologia: backendBolletta.tipologia,
      dataPagamento: backendBolletta.dataPagamento ? new Date(backendBolletta.dataPagamento) : undefined,
      idOfferta: backendBolletta.idOfferta,
      dFornitore: backendBolletta.dFornitore,
      cf: backendBolletta.cf,
      
      // Proprietà frontend per compatibilità
      id: backendBolletta.idBolletta?.toString(),
      tipo: backendBolletta.tipologia,
      fornitore: this.getFornitoreNome(backendBolletta.dFornitore, backendBolletta.tipologia),
      pagato: backendBolletta.dataPagamento != null
    };
  }

  // Ottieni il nome del fornitore in base al tipo e ID (semplificato per ora)
  private getFornitoreNome(dFornitore: number | undefined, tipologia: string): string {
    if (!dFornitore) return 'Sconosciuto';
    
    // Mapping semplificato - in un'app reale useresti una tabella fornitori
    if (tipologia === 'Gas') {
      return 'Gas Hero';
    } else if (tipologia === 'Luce') {
      return 'Luce Enel';
    } else if (tipologia === 'WiFi') {
      return 'WiFi FastWeb';
    }
    return 'Fornitore ' + dFornitore;
  }

  getStatistiche(): Observable<StatisticheCliente> {
    // Prendi l'utente corrente dalla localStorage per ottenere il CF
    const currentUser = localStorage.getItem('utente');
    if (!currentUser) {
      return of({ gas: 0, luce: 0, wifi: 0 });
    }
    
    const user = JSON.parse(currentUser);
    const cf = user.cf;
    
    if (!cf) {
      return of({ gas: 0, luce: 0, wifi: 0 });
    }
    
    // Chiamata al backend per ottenere le statistiche dell'utente
    return this.http.get<StatisticheCliente>(`${this.apiUrl}/utente/${cf}/statistiche`);
  }

  create(bolletta: Bolletta): Observable<Bolletta> {
    return this.http.post<Bolletta>(this.apiUrl, bolletta);
  }

  update(id: string, bolletta: Bolletta): Observable<Bolletta> {
    return this.http.put<Bolletta>(`${this.apiUrl}/${id}`, bolletta);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marcaComePagato(id: string, cvv: string, scontoScelto?: number): Observable<number> {
    const payload: any = { cvv };
    if (scontoScelto !== undefined && scontoScelto > 0) {
      payload.scontoScelto = scontoScelto;
    }
    return this.http.patch<number>(`${this.apiUrl}/${id}/pagato`, payload);
  }
  
}