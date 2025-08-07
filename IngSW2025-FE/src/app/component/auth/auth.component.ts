import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../service/auth.service';
import { RegistrationRequest } from '../../dto/auth.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  // Campi per il login
  email: string = '';
  password: string = '';
  
  // Campi aggiuntivi per la registrazione
  nome: string = '';
  cognome: string = '';
  cf: string = '';
  
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    
    if (this.isLoginMode) {
      if (this.isLoginFormValid()) {
        this.loginWithBackend();
      }
    } else {
      if (this.isRegisterFormValid()) {
        this.registerWithBackend();
      }
    }
  }

  private isLoginFormValid(): boolean {
    if (!this.email.trim()) {
      this.errorMessage = 'Inserisci l\'email';
      return false;
    }
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Inserisci un\'email valida (es. nome@dominio.com)';
      return false;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Inserisci la password';
      return false;
    }
    return true;
  }

  private isRegisterFormValid(): boolean {
    if (!this.nome.trim()) {
      this.errorMessage = 'Inserisci il nome';
      return false;
    }
    if (!this.cognome.trim()) {
      this.errorMessage = 'Inserisci il cognome';
      return false;
    }
    if (!this.cf.trim()) {
      this.errorMessage = 'Inserisci il codice fiscale';
      return false;
    }
    if (!this.email.trim()) {
      this.errorMessage = 'Inserisci l\'email';
      return false;
    }
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Inserisci un\'email valida (es. nome@dominio.com)';
      return false;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Inserisci la password';
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Login con verifica backend
  loginWithBackend(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.loginWithBackend(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          console.log('Login successful:', response.utente);
          this.router.navigate(['/bollette']);
        } else {
          this.errorMessage = response.message || 'Email o password non corretti';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore durante il login:', error);
        this.errorMessage = 'Errore di connessione. Riprova più tardi.';
      }
    });
  }

  // Registrazione con backend
  registerWithBackend(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const registrationData: RegistrationRequest = {
      cf: this.cf,
      mail: this.email,
      nome: this.nome,
      cognome: this.cognome,
      password: this.password,
      stipendio: 0 // Valore default
    };

    this.authService.register(registrationData).subscribe({
      next: (utente) => {
        this.isLoading = false;
        console.log('Registrazione completata:', utente);
        alert(`Registrazione completata per ${utente.nome} ${utente.cognome}! Ora puoi effettuare il login.`);
        this.isLoginMode = true;
        this.clearForm();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Errore durante la registrazione:', error);
        this.errorMessage = 'Errore durante la registrazione. Verifica che l\'email e il codice fiscale non siano già utilizzati.';
      }
    });
  }

  // Metodi di fallback (compatibilità)
  login(): void {
    // Usa il nuovo metodo con backend
    this.loginWithBackend();
  }

  register(): void {
    // Usa il nuovo metodo con backend
    this.registerWithBackend();
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.clearForm();
  }

  private clearForm(): void {
    this.email = '';
    this.password = '';
    this.nome = '';
    this.cognome = '';
    this.cf = '';
    this.errorMessage = '';
  }
}
