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
  @Output() pagamentoEffettuato = new EventEmitter<void>();
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
    this.pagamentoEffettuato.emit();
  }
}
