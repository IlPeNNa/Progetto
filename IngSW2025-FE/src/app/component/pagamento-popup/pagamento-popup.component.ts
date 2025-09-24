import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bolletta } from '../../dto/bolletta.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-pagamento-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento-popup.component.html',
  styleUrls: ['./pagamento-popup.component.scss']
})
export class PagamentoPopupComponent implements OnInit {
  @Input() bolletta: Bolletta | null = null;
  @Output() pagamentoEffettuato = new EventEmitter<{cvv: string, scontoScelto: number}>();
  @Output() chiudi = new EventEmitter<void>();
  
  pagamentoForm = {
    nomeTitolare: '',
    cognomeTitolare: '',
    codiceCarta: '',
    cvv: '',
    scadenza: ''
  };
  erroreScadenza: string = '';
  
  // Variabili per lo sconto
  puntiUtente: number = 0;
  livelloUtente: number = 0;
  scontoMassimoDisponibile: number = 0;
  scontoScelto: number = 0;
  scontoSelezionato: number = 0;
  opzioniSconto: {percentuale: number, costoInPunti: number}[] = [];
  importoConSconto: number = 0;
  importoFinale: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.caricaDatiSconto();
  }

  caricaDatiSconto() {
    const utente = this.authService.getCurrentUser();
    if (utente && utente.cf) {
      // Ottieni i punti dell'utente
      this.authService.getUtenteByCf(utente.cf).subscribe({
        next: (utenteCompleto) => {
          this.puntiUtente = utenteCompleto.punti || 0;
          this.calcolaScontoMassimo();
          this.generaOpzioniSconto();
        },
        error: (error) => {
          console.error('Errore nel caricamento dati utente:', error);
          this.puntiUtente = 0;
        }
      });
    }
  }

  calcolaScontoMassimo() {
    // Calcola il livello dell'utente (1 livello ogni 50 punti)
    this.livelloUtente = Math.floor(this.puntiUtente / 50);
    // Calcola il massimo sconto disponibile (1% per livello, max 70%)
    this.scontoMassimoDisponibile = Math.min(this.livelloUtente, 70);
  }

  generaOpzioniSconto() {
    this.opzioniSconto = [];
    for (let i = 10; i <= this.scontoMassimoDisponibile; i += 10) {
      this.opzioniSconto.push({
        percentuale: i,
        costoInPunti: i * 50 // 50 punti per ogni % di sconto
      });
    }
    // Aggiungi anche il massimo se non è multiplo di 10
    if (this.scontoMassimoDisponibile % 10 !== 0 && this.scontoMassimoDisponibile > 0) {
      this.opzioniSconto.push({
        percentuale: this.scontoMassimoDisponibile,
        costoInPunti: this.scontoMassimoDisponibile * 50
      });
    }
  }

  onScontoChange() {
    this.calcolaImportoConSconto();
  }

  calcolaImportoConSconto() {
    if (this.bolletta && this.scontoSelezionato > 0) {
      const sconto = (this.bolletta.importo * this.scontoSelezionato) / 100;
      this.importoConSconto = this.bolletta.importo - sconto;
      this.importoFinale = this.importoConSconto;
    } else {
      this.importoConSconto = this.bolletta?.importo || 0;
      this.importoFinale = this.importoConSconto;
    }
  }

  chiudiPopup() {
    this.erroreScadenza = '';
    this.chiudi.emit();
  }

  // Formatta il codice carta con spazi ogni 4 cifre
  formatCodiceCarta(event: any) {
    let value = event.target.value.replace(/\s/g, ''); // Rimuove tutti gli spazi
    let formattedValue = '';
    
    // Limita a 16 cifre e aggiunge spazi ogni 4
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    this.pagamentoForm.codiceCarta = formattedValue;
    event.target.value = formattedValue;
  }

  // Formatta la data di scadenza MM/AA
  formatScadenza(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Rimuove tutto tranne i numeri
    let formattedValue = '';
    
    // Limita a 4 cifre e aggiunge lo slash dopo 2
    if (value.length >= 2) {
      formattedValue = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      formattedValue = value;
    }
    
    this.pagamentoForm.scadenza = formattedValue;
    event.target.value = formattedValue;
  }

  effettuaPagamento() {
    // Validazione scadenza
    const [mese, anno] = this.pagamentoForm.scadenza.split('/').map(Number);
    const oggi = new Date();
    const annoCorrente = oggi.getFullYear() % 100;
    const meseCorrente = oggi.getMonth() + 1;
    if (anno < annoCorrente || (anno === annoCorrente && mese < meseCorrente)) {
      this.erroreScadenza = 'La carta è scaduta e non può essere utilizzata.';
      return;
    }
    this.erroreScadenza = '';
    // Rimuove gli spazi dal codice carta prima di inviarlo
    const codiceCarta = this.pagamentoForm.codiceCarta.replace(/\s/g, '');
    
    // Invia CVV e percentuale sconto scelto
    this.pagamentoEffettuato.emit({
      cvv: this.pagamentoForm.cvv,
      scontoScelto: this.scontoSelezionato
    });
  }
}
