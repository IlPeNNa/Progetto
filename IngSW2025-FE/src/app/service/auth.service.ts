import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, RegistrationRequest, Utente } from '../dto/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Recupera utente dal backend tramite CF
  getUtenteByCf(cf: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.apiUrl}/${cf}`);
  }
  private apiUrl = '/api/utenti';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  private usernameSubject = new BehaviorSubject<string>(this.getStoredUsername());
  private utenteSubject = new BehaviorSubject<Utente | null>(this.getStoredUser());

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public username$ = this.usernameSubject.asObservable();
  public utente$ = this.utenteSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  private getStoredUsername(): string {
    return localStorage.getItem('username') || '';
  }

  private getStoredUser(): Utente | null {
    const userStr = localStorage.getItem('utente');
    return userStr ? JSON.parse(userStr) : null;
  }

  getScontoUtente(cf: string) {
    return this.http.get<number>(`/api/utenti/${cf}/sconto`);
  }

  // Login con chiamata al backend
  loginWithBackend(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = {
      mail: email,
      password: password
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest, this.httpOptions)
      .pipe(
        map(response => {
          if (response.success && response.utente) {
            // Salva i dati di autenticazione nel localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', `${response.utente.nome} ${response.utente.cognome}`);
            localStorage.setItem('utente', JSON.stringify(response.utente));
            
            // Aggiorna i BehaviorSubjects
            this.isLoggedInSubject.next(true);
            this.usernameSubject.next(`${response.utente.nome} ${response.utente.cognome}`);
            this.utenteSubject.next(response.utente);
          }
          return response;
        }),
        catchError(error => {
          console.error('Errore durante il login:', error);
          return throwError(() => new Error('Errore durante il login'));
        })
      );
  }

  // Registrazione di un nuovo utente
  register(registrationData: RegistrationRequest): Observable<Utente> {
    return this.http.post<Utente>(this.apiUrl, registrationData, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Errore durante la registrazione:', error);
          return throwError(() => new Error('Errore durante la registrazione'));
        })
      );
  }

  // Aggiorna ultimo accesso e punti utente
  updateAccessoUtente(cf: string): Observable<Utente> {
    return this.http.put<Utente>(`${this.apiUrl}/${cf}/accesso`, {}, this.httpOptions);
  }

  // Recupera la classifica utenti ordinata per punti
  getClassificaUtenti(): Observable<Utente[]> {
    return this.http.get<Utente[]>(`${this.apiUrl}/classifica`);
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('utente');
    
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next('');
    this.utenteSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getUsername(): string {
    return this.getStoredUsername();
  }

  getCurrentUser(): Utente | null {
    const userStr = localStorage.getItem('utente');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verifica se l'utente è autenticato tramite backend
  verifyAuthentication(): Observable<boolean> {
    const user = this.getCurrentUser();
    if (!user || !user.cf) {
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.http.get<Utente>(`${this.apiUrl}/${user.cf}`)
      .pipe(
        map(response => !!response),
        catchError(error => {
          console.error('Errore nella verifica autenticazione:', error);
          this.logout(); // Logout automatico se la verifica fallisce
          return new Observable<boolean>(observer => {
            observer.next(false);
            observer.complete();
          });
        })
      );
  }
}
