import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utente } from '../dto/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = '/api/utenti';

  constructor(private http: HttpClient) {}

  // Test connessione backend
  testConnection(): Observable<Utente[]> {
    return this.http.get<Utente[]>(this.apiUrl);
  }

  // Test creazione utente di test
  createTestUser(): Observable<Utente> {
    const testUser: Utente = {
      cf: 'TSTUST85M01H501T',
      mail: 'test@example.com',
      nome: 'Mario',
      cognome: 'Rossi',
      password: 'test123',
      stipendio: 30000
    };

    return this.http.post<Utente>(this.apiUrl, testUser);
  }
}
