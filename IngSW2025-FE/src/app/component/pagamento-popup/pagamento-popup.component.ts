import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bolletta } from '../../dto/bolletta.model';

@Component({
  selector: 'app-pagamento-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento-popup.component.html',
  styleUrls: ['./pagamento-popup.component.scss']
})
export class PagamentoPopupComponent {
  @Input() bolletta: Bolletta | null = null;
  @Output() pagamentoEffettuato = new EventEmitter<string>();
  @Output() chiudi = new EventEmitter<void>();
  
  pagamentoForm = {
    nomeTitolare: '',
    cognomeTitolare: '',
    codiceCarta: '',
    cvv: '',
    scadenza: ''
  };
  erroreScadenza: string = '';

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
    this.pagamentoEffettuato.emit(this.pagamentoForm.cvv); // invia il CVV
  }
}
