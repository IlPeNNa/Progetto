import { Component, OnInit } from '@angular/core';
import { SalaryService } from '../../service/salary.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Utente } from '../../dto/auth.model';

@Component({
  selector: 'app-salary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './salary-dashboard.component.html',
  styleUrls: ['./salary-dashboard.component.scss']
})
export class SalaryDashboardComponent implements OnInit {
  stipendioNetto: number | null = null;
  stipendioLordo: number | null = null;
  nome: string = '';
  cognome: string = '';
  codiceFiscale: string = '';
  showNetto: boolean = false;

  constructor(private salaryService: SalaryService, private authService: AuthService) {}

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUsername(): string {
    return this.authService.getUsername();
  }
  
  ngOnInit(): void {
    const utente: Utente | null = this.authService['getStoredUser']();
    if (utente && utente.cf) {
      this.codiceFiscale = utente.cf;
      this.nome = utente.nome;
      this.cognome = utente.cognome;
      // Chiamata backend per stipendio netto e lordo
      this.salaryService.getStipendioNetto(this.codiceFiscale).subscribe({
        next: (netto) => {
          this.showNetto = true;
          this.stipendioNetto = netto;
          this.stipendioLordo = utente.stipendio ?? null;
        },
        error: () => {
          this.showNetto = false;
          this.stipendioNetto = null;
        }
      });
    } else {
      this.showNetto = false;
    }
  }
}
