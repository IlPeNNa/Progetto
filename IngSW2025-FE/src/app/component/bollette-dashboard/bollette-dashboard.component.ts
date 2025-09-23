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
import { Attiva } from '../../dto/attiva.model';

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
  statistiche: any = { gas: 0, luce: 0, wifi: 0, acqua: 0, rifiuti: 0 };
  displayedColumns: string[] = ['idBolletta', 'importo', 'tipologia', 'scadenza', 'dataPagamento', 'actions'];
  offerte: Offerta[] = [];
  attivazioni: Attiva[] = [];
  filtroDataDa: Date | null = null;
  filtroDataA: Date | null = null;
  filtroTipo: string = '';
  filtroPagato: boolean | null = false;
  // Notifiche Chrome
  notificheMostrate: Set<string> = new Set();
  // Hover state per bottoni attivazione
  hoveredOffertaId: number | null = null;



  constructor(
    private authService: AuthService,
    private bollettaService: BollettaService,
    private router: Router,
    private offertaService: OffertaService
  ) {}

  get showHrFlow(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user || !user.mail) return false;
    return user.mail.toLowerCase().endsWith('@hrflow.it');
  }

  ngOnInit(): void {
    this.loadBollette();
    this.loadStatistiche();
    this.caricaOfferteDisponibili();
    this.caricaAttivazioni();
    setTimeout(() => this.mostraNotificheScadenza(), 1000);
  }

  caricaOfferteDisponibili(): void {
    this.offertaService.getOfferte().subscribe((offerte: Offerta[]) => {
      this.offerte = offerte;
    });
  }

  caricaAttivazioni(): void {
    const utente = this.authService.getCurrentUser();
    if (!utente || !utente.cf) return;
    this.offertaService.getAttivazioniByCf(utente.cf).subscribe((attivazioni: Attiva[]) => {
      this.attivazioni = attivazioni;
    });
  }

  getDataAttivazione(offerta: Offerta): string | null {
    const att = this.attivazioni.find(a => a.idOfferta === offerta.idOfferta);
    return att ? att.dataAttivazione : null;
  }

  vaiAlleOfferte(): void {
    this.router.navigate(['/offerte']);
  }

  aggiornaStatisticheDaBollette(): void {
    const stats = { gas: 0, luce: 0, wifi: 0, acqua: 0, rifiuti: 0 };
    const totale = this.bollette.length;
    this.bollette.forEach(b => {
      const tipo = b.tipo?.toLowerCase() || b.tipologia?.toLowerCase();
      if (tipo === 'gas') stats.gas++;
      else if (tipo === 'luce') stats.luce++;
      else if (tipo === 'wifi') stats.wifi++;
      else if (tipo === 'acqua') stats.acqua++;
      else if (tipo === 'rifiuti') stats.rifiuti++;
    });
    if (totale > 0) {
      // Calcolo percentuali precise per tipo
      const percentuali = [
        (stats.gas / totale) * 100,
        (stats.luce / totale) * 100,
        (stats.wifi / totale) * 100,
        (stats.acqua / totale) * 100,
        (stats.rifiuti / totale) * 100
      ];
      let arrotondate = percentuali.map(Math.floor);
      let somma = arrotondate.reduce((a, b) => a + b, 0);
      let diff = 100 - somma;

      // Se acqua e rifiuti hanno lo stesso numero di bollette, forziamo la stessa percentuale
      if (stats.acqua === stats.rifiuti && stats.acqua > 0) {
        // Calcola la media delle due percentuali (usando la somma delle due parti decimali)
        const media = Math.floor(((percentuali[3] + percentuali[4]) / 2));
        arrotondate[3] = media;
        arrotondate[4] = media;
        // Ricalcola la somma e la differenza
        somma = arrotondate[0] + arrotondate[1] + arrotondate[2] + arrotondate[3] + arrotondate[4];
        diff = 100 - somma;
        // Se la somma non è 100, distribuisci la differenza su gas, luce, wifi (le prime tre categorie)
        if (diff !== 0) {
          const idx = [0,1,2];
          for (let i = 0; i < Math.abs(diff); i++) {
            arrotondate[idx[i%3]] += diff > 0 ? 1 : -1;
          }
        }
      } else {
        // Distribuisci la differenza partendo dai tipi con la parte decimale più alta
        if (diff > 0) {
          const decimali = percentuali.map((p, i) => ({i, val: p - Math.floor(p)}));
          decimali.sort((a, b) => b.val - a.val);
          for (let i = 0; i < diff; i++) {
            arrotondate[decimali[i].i]++;
          }
        }
      }
      this.statistiche = {
        gas: arrotondate[0],
        luce: arrotondate[1],
        wifi: arrotondate[2],
        acqua: arrotondate[3],
        rifiuti: arrotondate[4]
      };
    } else {
      this.statistiche = { gas: 0, luce: 0, wifi: 0, acqua: 0, rifiuti: 0 };
    }
  }

  loadBollette(): void {
    this.bollettaService.getAll().subscribe({
      next: (data) => {
        this.bollette = data;
  this.aggiornaStatisticheDaBollette();
  this.caricaOfferteDisponibili();
  this.caricaAttivazioni();
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
    const { gas, luce, wifi, acqua, rifiuti } = this.statistiche;
    const total = gas + luce + wifi + acqua + rifiuti;
    if (total === 0) {
      return 'conic-gradient(#4CAF50 0deg 360deg)';
    }
    const gasAngle = (gas / total) * 360;
    const luceAngle = gasAngle + (luce / total) * 360;
    const wifiAngle = luceAngle + (wifi / total) * 360;
    const acquaAngle = wifiAngle + (acqua / total) * 360;
    return `conic-gradient(
      #4CAF50 0deg ${gasAngle}deg,
      #FF9800 ${gasAngle}deg ${luceAngle}deg,
      #2196F3 ${luceAngle}deg ${wifiAngle}deg,
      #1976d2 ${wifiAngle}deg ${acquaAngle}deg,
      #8d6e63 ${acquaAngle}deg 360deg
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
      // Prima ottengo lo sconto dell'utente corrente
      const utente = this.authService.getCurrentUser();
      if (utente && utente.cf) {
        // Ottengo i dati dell'utente per avere i punti attuali
        this.authService.getUtenteByCf(utente.cf).subscribe({
          next: (utenteCompleto) => {
            const puntiAttuali = utenteCompleto.punti || 0;
            const importoOriginale = this.bollettaSelezionata!.importo;
            
            // Calcolo il livello massimo che l'utente può raggiungere con i suoi punti attuali
            let livelloMassimoDisponibile = 0;
            let puntiTotaliUsati = 0;
            for (let i = 1; i <= 70; i++) {
              const puntiPerQuestoLivello = 10 + (i - 1) * 5; // Sistema progressivo
              if (puntiTotaliUsati + puntiPerQuestoLivello <= puntiAttuali) {
                puntiTotaliUsati += puntiPerQuestoLivello;
                livelloMassimoDisponibile = i;
              } else {
                break;
              }
            }
            
            // L'utente può scegliere di usare tutto il suo sconto disponibile
            const scontoPercentualeDisponibile = Math.min(livelloMassimoDisponibile, 70);
            const scontoInEuro = (importoOriginale * scontoPercentualeDisponibile) / 100;
            const importoFinale = Math.max(0, importoOriginale - scontoInEuro);
            
            // Calcolo i punti esatti da usare per applicare lo sconto
            // Uso solo i punti necessari per raggiungere il livello di sconto applicato
            let puntiUsatiPerSconto = 0;
            for (let i = 1; i <= scontoPercentualeDisponibile; i++) {
              puntiUsatiPerSconto += 10 + (i - 1) * 5; // Sistema progressivo
            }
            
            // Calcolo punti bonus per pagamento anticipato (se prima della scadenza)
            const dataScadenza = new Date(this.bollettaSelezionata!.scadenza);
            const oggi = new Date();
            const puntiBonus = dataScadenza > oggi ? 30 : 0;
            
            // I punti utilizzati sono solo quelli per il livello di sconto applicato
            const puntiUsati = puntiUsatiPerSconto;
            const puntiRimanenti = puntiAttuali - puntiUsati + puntiBonus;
            
            // Procedo con il pagamento (il backend dovrebbe detrarre i punti usati)
            this.bollettaService.marcaComePagato(this.bollettaSelezionata!.id!, cvv).subscribe({
              next: (sconto) => {
                let messaggio = 'Pagamento effettuato con successo!';
                if (scontoInEuro > 0) {
                  messaggio += `\n\nDettagli pagamento:`;
                  messaggio += `\nImporto originale: €${importoOriginale.toFixed(2)}`;
                  messaggio += `\nSconto applicato (${scontoPercentualeDisponibile}%): -€${scontoInEuro.toFixed(2)}`;
                  messaggio += `\nImporto pagato: €${importoFinale.toFixed(2)}`;
                } else {
                  messaggio += `\nImporto pagato: €${importoOriginale.toFixed(2)}`;
                }
                alert(messaggio);
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
          },
          error: () => {
            // Se non riesco a ottenere i dati utente, procedo con pagamento senza sconto
            this.bollettaService.marcaComePagato(this.bollettaSelezionata!.id!, cvv).subscribe({
              next: (sconto) => {
                const importoOriginale = this.bollettaSelezionata!.importo;
                alert(`Pagamento effettuato con successo!\nImporto pagato: €${importoOriginale.toFixed(2)}`);
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
          }
        });
      } else {
        // Utente non valido, pagamento senza sconto
        this.bollettaService.marcaComePagato(this.bollettaSelezionata.id, cvv).subscribe({
          next: (sconto) => {
            alert('Pagamento effettuato con successo!');
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
      }
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
      case 'acqua':
        return 'water_drop';
      case 'rifiuti':
        return 'delete';
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

  attivaOfferta(offerta: Offerta): void {
    const utente = this.authService.getCurrentUser();
    if (!utente || !utente.cf) {
      alert('Utente non valido');
      return;
    }

    // Controlla se esiste già un'offerta attiva dello stesso tipo
    const offertaStessoTipoAttiva = this.offerte.find(o => 
      o.tipo === offerta.tipo && 
      o.idOfferta !== offerta.idOfferta && 
      this.getDataAttivazione(o)
    );

    if (offertaStessoTipoAttiva) {
      const conferma = confirm(
        `Hai già un'offerta ${offerta.tipo} attiva (${offertaStessoTipoAttiva.fornitore?.nome}).\n\n` +
        `Per attivare questa nuova offerta devi prima disattivare quella esistente.\n\n` +
        `Vuoi disattivare l'offerta attuale e attivare questa nuova?`
      );
      
      if (!conferma) {
        return; // L'utente ha annullato
      }

      // Disattiva prima l'offerta esistente
      this.annullaOfferta(offertaStessoTipoAttiva);
      
      // Aspetta un momento per completare la disattivazione, poi attiva la nuova
      setTimeout(() => {
        this.procediConAttivazione(offerta, utente.cf!);
      }, 500);
      
      return;
    }

    // Se non ci sono conflitti, procedi direttamente con l'attivazione
    this.procediConAttivazione(offerta, utente.cf);
  }

  private procediConAttivazione(offerta: Offerta, cf: string): void {
    const attivazione: Attiva = {
      cf: cf,
      idOfferta: offerta.idOfferta,
      dataAttivazione: new Date().toISOString().split('T')[0]
    };
    
    this.offertaService.attivaOffertaPerUtente(attivazione).subscribe(
      (res: Attiva) => {
        alert('Offerta attivata correttamente!\nData: ' + attivazione.dataAttivazione);
        this.caricaOfferteDisponibili();
        this.caricaAttivazioni();
      },
      err => {
        alert('Errore durante l\'attivazione dell\'offerta');
      }
    );
  }

  annullaOfferta(offerta: Offerta): void {
    const utente = this.authService.getCurrentUser();
    if (!utente || !utente.cf) {
      alert('Utente non valido');
      return;
    }
    
    this.offertaService.annullaAttivazioneOfferta(utente.cf, offerta.idOfferta).subscribe(
      () => {
        alert('Offerta disattivata correttamente');
        this.caricaOfferteDisponibili();
        this.caricaAttivazioni();
      },
      err => {
        alert('Errore durante l\'annullamento dell\'attivazione');
      }
    );
  }

  onButtonHover(offertaId: number): void {
    this.hoveredOffertaId = offertaId;
  }

  onButtonLeave(): void {
    this.hoveredOffertaId = null;
  }

  getButtonText(offerta: Offerta): string {
    const isAttivata = this.getDataAttivazione(offerta);
    if (isAttivata && this.hoveredOffertaId === offerta.idOfferta) {
      return 'Disattiva';
    }
    return isAttivata ? 'Attivata' : 'Attiva';
  }

  getOfferteAttive(): Offerta[] {
    return this.offerte.filter(offerta => this.getDataAttivazione(offerta));
  }
}


