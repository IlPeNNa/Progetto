import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { BollettaService } from '../../service/bolletta.service';
import { Bolletta, StatisticheCliente, TipoBolletta } from '../../dto/bolletta.model';
import { Offerta } from '../../dto/offerta.model';
import { OffertaService } from '../../service/offerta.service';
import { PagamentoPopupComponent } from '../pagamento-popup/pagamento-popup.component';

@Component({
  selector: 'app-bollette-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    PagamentoPopupComponent
  ],
  templateUrl: './bollette-dashboard.component.html',
  styleUrl: './bollette-dashboard.component.scss',
  providers: [OffertaService]
})
export class BolletteDashboardComponent implements OnInit {
  pagamentoPopupVisible: boolean = false;
  bollettaSelezionata: Bolletta | null = null;
  bollette: Bolletta[] = [];
  statistiche: StatisticheCliente = { gas: 0, luce: 0, wifi: 0 };
  displayedColumns: string[] = ['idBolletta', 'importo', 'tipologia', 'scadenza', 'dataPagamento', 'actions'];
  offerteAttive: Offerta[] = [];
  filtroDataDa: Date | null = null;
  filtroDataA: Date | null = null;
  filtroTipo: string = '';
  filtroPagato: boolean | null = false;
  // Notifiche Chrome
  notificheMostrate: Set<string> = new Set();



  constructor(
    private authService: AuthService,
    private bollettaService: BollettaService,
    private router: Router,
    private offertaService: OffertaService
  ) {}

  ngOnInit(): void {
  this.loadBollette();
  this.loadStatistiche();
  this.caricaOfferteAttive();
  setTimeout(() => this.mostraNotificheScadenza(), 1000);
  }

  caricaOfferteAttive(): void {
    this.offertaService.getOfferte().subscribe((offerte: Offerta[]) => {
      this.offerteAttive = offerte.filter((o: Offerta) => !!o.dataAttivazione);
    });
  }

  vaiAlleOfferte(): void {
    this.router.navigate(['/offerte']);
  }

  aggiornaStatisticheDaBollette(): void {
    const stats = { gas: 0, luce: 0, wifi: 0 };
    const totale = this.bollette.length;
    this.bollette.forEach(b => {
      const tipo = b.tipo?.toLowerCase() || b.tipologia?.toLowerCase();
      if (tipo === 'gas') stats.gas++;
      else if (tipo === 'luce') stats.luce++;
      else if (tipo === 'wifi') stats.wifi++;
    });
    this.statistiche = totale > 0
      ? {
          gas: Math.round((stats.gas / totale) * 100),
          luce: Math.round((stats.luce / totale) * 100),
          wifi: Math.round((stats.wifi / totale) * 100)
        }
      : { gas: 0, luce: 0, wifi: 0 };
  }

  loadBollette(): void {
    this.bollettaService.getAll().subscribe({
      next: (data) => {
        this.bollette = data;
        this.aggiornaStatisticheDaBollette();
        this.caricaOfferteAttive();
        this.mostraNotificheScadenza();
      },
      error: (error) => {
        console.error('Errore nel caricamento delle bollette:', error);
      }
    });
  }

  loadStatistiche(): void {
    this.bollettaService.getStatistiche().subscribe({
      next: (data) => {
        this.statistiche = data;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle statistiche:', error);
      }
    });
  }

  getUsername(): string {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  getChartStyle(): string {
    const { gas, luce, wifi } = this.statistiche;
    const total = gas + luce + wifi;
    if (total === 0) {
      return 'conic-gradient(#4CAF50 0deg 360deg)';
    }
    const gasAngle = (gas / total) * 360;
    const luceAngle = gasAngle + (luce / total) * 360;
    return `conic-gradient(
      #4CAF50 0deg ${gasAngle}deg,
      #FF9800 ${gasAngle}deg ${luceAngle}deg,
      #2196F3 ${luceAngle}deg 360deg
    )`;
  }

  getTipoBollettaIcon(tipo: TipoBolletta): string {
    switch (tipo) {
      case TipoBolletta.GAS:
        return 'local_gas_station';
      case TipoBolletta.LUCE:
        return 'lightbulb';
      case TipoBolletta.WIFI:
        return 'wifi';
      default:
        return 'receipt';
    }
  }

  getTipoBollettaColor(tipo: TipoBolletta): string {
    switch (tipo) {
      case TipoBolletta.GAS:
        return '#4CAF50'; // Gas: verde
      case TipoBolletta.LUCE:
        return '#FF9800'; // Luce: arancione
      case TipoBolletta.WIFI:
        return '#2196F3'; // WiFi: blu
      default:
        return '#666';
    }
  }

  apriPagamentoPopup(bolletta: Bolletta): void {
    this.bollettaSelezionata = bolletta;
    this.pagamentoPopupVisible = true;
  }

  onPagamentoEffettuato(cvv: string) {
    if (this.bollettaSelezionata && this.bollettaSelezionata.id) {
      this.bollettaService.marcaComePageto(this.bollettaSelezionata.id, cvv).subscribe({
        next: (sconto) => {
          if (sconto > 0) {
            alert(`Pagamento effettuato con successo!\nApplicato uno sconto del ${sconto}%.`);
          } else {
            alert('Pagamento effettuato con successo!');
          }
          this.loadBollette();
        },
        error: () => {
          alert('Errore durante il pagamento.');
        },
        complete: () => {
          this.pagamentoPopupVisible = false;
          this.bollettaSelezionata = null;
        }
      });
    } else {
      this.pagamentoPopupVisible = false;
      this.bollettaSelezionata = null;
    }
  }

  onChiudiPopup() {
    this.pagamentoPopupVisible = false;
    this.bollettaSelezionata = null;
  }

  eliminaBolletta(bolletta: Bolletta): void {
    if (bolletta.id && confirm('Sei sicuro di voler eliminare questa bolletta?')) {
      this.bollettaService.delete(bolletta.id).subscribe({
        next: () => {
          this.bollette = this.bollette.filter(b => b.id !== bolletta.id);
        },
        error: (error) => {
          console.error('Errore nell\'eliminazione della bolletta:', error);
        }
      });
    }
  }

  getStatoPagamento(bolletta: Bolletta): string {
    return bolletta.pagato ? 'Pagato' : 'Da pagare';
  }

  getStatoClass(bolletta: Bolletta): string {
    return bolletta.pagato ? 'stato-pagato' : 'stato-non-pagato';
  }

  isScaduta(bolletta: Bolletta): boolean {
    return !bolletta.pagato && new Date() > bolletta.scadenza;
  }

  get bolletteFiltrate(): Bolletta[] {
    return this.bollette.filter(bolletta => {
      if (this.filtroDataDa && bolletta.scadenza < this.filtroDataDa) {
        return false;
      }
      if (this.filtroDataA && bolletta.scadenza > this.filtroDataA) {
        return false;
      }
      if (this.filtroTipo.toLocaleLowerCase() && bolletta.tipo?.toLocaleLowerCase() !== this.filtroTipo.toLocaleLowerCase()) {
        return false;
      }
      if (this.filtroPagato !== null && bolletta.pagato !== this.filtroPagato) {
        return false;
      }
      return true;
    });
  }

  clearFiltri(): void {
    this.filtroDataDa = null;
    this.filtroDataA = null;
    this.filtroTipo = '';
    this.filtroPagato = null;
  }

  getTipoIcon(tipologia: string | undefined): string {
    if (!tipologia) return 'receipt';
    switch (tipologia.toLowerCase()) {
      case 'gas':
        return 'local_gas_station';
      case 'luce':
        return 'lightbulb';
      case 'wifi':
        return 'wifi';
      default:
        return 'receipt';
    }
  }

    // --- NOTIFICHE CHROME ---
    mostraNotificheScadenza(): void {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
        return;
      }
      const oggi = new Date();
      this.bollette.forEach(b => {
        if (b.pagato) return;
        const scadenza = new Date(b.scadenza);
        const diffGiorni = Math.ceil((scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
        const idNotifica = `${b.idBolletta || b.id}`;
        if (diffGiorni < 2 && diffGiorni>=0 && !this.notificheMostrate.has(idNotifica + '-2gg')) {
          new Notification('Bolletta in scadenza', {
            body: `La bolletta ${idNotifica} scade tra 2 giorni e non è stata ancora pagata.`,
            icon: '/mybills.ico'
          });
          this.notificheMostrate.add(idNotifica + '-2gg');
        }
        if (diffGiorni < 0 && !this.notificheMostrate.has(idNotifica + '-scaduta')) {
          new Notification('Bolletta scaduta', {
            body: `La bolletta ${idNotifica} è scaduta e non è stata pagata!`,
            icon: '/mybills.ico'
          });
          this.notificheMostrate.add(idNotifica + '-scaduta');
        }
      });
    }
}


