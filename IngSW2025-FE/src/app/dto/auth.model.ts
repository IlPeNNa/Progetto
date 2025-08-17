// Modello per l'utente
export interface Utente {
  cf?: string;
  mail: string;
  nome: string;
  cognome: string;
  stipendio?: number;
  password?: string; // Non dovrebbe essere mai esposta dal backend in operazioni reali
  punti?: number;
  ultimo_accesso?: string; // ISO datetime string
}

// DTO per la richiesta di login
export interface LoginRequest {
  mail: string;
  password: string;
}

// DTO per la risposta di login
export interface LoginResponse {
  success: boolean;
  message: string;
  utente?: Utente;
}

// DTO per la registrazione
export interface RegistrationRequest {
  cf: string;
  mail: string;
  nome: string;
  cognome: string;
  password: string;
  stipendio?: number;
}
