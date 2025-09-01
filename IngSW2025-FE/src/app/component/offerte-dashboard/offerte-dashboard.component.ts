import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offerta } from '../../dto/offerta.model';
import { OffertaService } from '../../service/offerta.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-offerte-dashboard',
  templateUrl: './offerte-dashboard.component.html',
  styleUrls: ['./offerte-dashboard.component.scss'],
  imports: [ MatToolbarModule, FormsModule, CommonModule, MatSidenavModule, MatListModule, MatIconModule, RouterModule]
})
export class OfferteDashboardComponent implements OnInit {
  caricaOffertaSuggerita(): void {
    if (this.filtro.tipo) {
      this.offertaService.getOffertaSuggerita(this.filtro.tipo, this.filtro.consumoMedio)
        .subscribe(offerta => this.offertaSuggerita = offerta);
    } else {
      this.offertaSuggerita = undefined;
    }
  }
  oraCorrente: string = '';
  offerte: Offerta[] = [];
  offertaSuggerita?: Offerta;
  filtro = {
  tipo: '',
  durataMese: undefined,
  prezzoMax: undefined,
  consumoMedio: undefined,
  energiaVerde: false,
  nessunVincolo: false,
  pagamentoRate: false,
  modemGratuito: false,
  };

  constructor(
    private offertaService: OffertaService,
    private router: Router,
    private authService: AuthService
  ) {}
  vaiHome(): void {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.caricaOfferte();
    this.caricaOffertaSuggerita();
    this.aggiornaOraCorrente();
    setInterval(() => this.aggiornaOraCorrente(), 1000 * 60); // aggiorna ogni minuto
  }

  aggiornaOraCorrente(): void {
    const now = new Date();
    this.oraCorrente = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  caricaOfferte(): void {
    const tipo = this.filtro.tipo && this.filtro.tipo.trim() !== '' ? this.filtro.tipo : undefined;
    const durataMese = this.filtro.durataMese !== undefined && this.filtro.durataMese !== null ? this.filtro.durataMese : undefined;
    const prezzoMax = this.filtro.prezzoMax !== undefined && this.filtro.prezzoMax !== null ? this.filtro.prezzoMax : undefined;
    this.offertaService.getOfferte(tipo, durataMese, prezzoMax)
      .subscribe(offerte => {
        let filtered = offerte;
        if (this.filtro.nessunVincolo) {
          this.offerte = offerte;
          return;
        }
        const opzioni: string[] = [];
        if (this.filtro.energiaVerde) opzioni.push('energia verde');
        if (this.filtro.pagamentoRate) opzioni.push('rate');
        if (this.filtro.modemGratuito) opzioni.push('modem');
        if (opzioni.length > 0) {
          filtered = filtered.filter(o => {
            const descr = o.descrizione ? o.descrizione.toLowerCase() : '';
            return opzioni.some(opt => descr.includes(opt));
          });
        }
        this.offerte = filtered;
      });
  }

  filtraOfferte(): void {
    this.caricaOfferte();
    this.caricaOffertaSuggerita();
  }

  attivaOfferta(offerta: Offerta): void {
    this.offertaService.attivaOfferta(offerta.idOfferta).subscribe(
      (res: Offerta) => {
        const now = new Date();
        const dataOra = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        alert('Offerta attivata correttamente!\nData e ora: ' + dataOra);
        this.caricaOfferte();
      },
      err => {
        alert('Errore durante l\'attivazione dell\'offerta');
      }
    );
  }
  getUsername(): string {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
