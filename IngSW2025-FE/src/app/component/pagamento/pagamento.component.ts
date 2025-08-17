import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bolletta } from '../../dto/bolletta.model';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent {
  @Input() bolletta: Bolletta | null = null;
  @Output() pagamentoCompletato = new EventEmitter<boolean>();
  pagamentoForm = {
    nomeTitolare: '',
    cognomeTitolare: '',
    codiceCarta: '',
    cvv: '',
    scadenza: ''
  };
  erroreScadenza: string = '';

  chiudiForm() {
    this.erroreScadenza = '';
    this.pagamentoCompletato.emit(false);
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
    // Validazione CVV
    if (typeof this.pagamentoForm.cvv !== 'string' || this.pagamentoForm.cvv.length !== 3 || !/^[0-9]{3}$/.test(this.pagamentoForm.cvv)) {
      this.erroreScadenza = 'Il CVV deve essere composto da esattamente 3 cifre.';
      return;
    }
    // Simula pagamento
    this.pagamentoCompletato.emit(true);
  }
}
