// ...existing code...
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gamification',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './gamification.component.html',
  styleUrls: ['./gamification.component.scss']
})
export class GamificationComponent {
  livello = 3;
  punti = 360;
  badge = [
    { nome: 'Puntuale', icona: 'schedule', colore: '#FFA726' },
  { nome: 'Eco', icona: 'leaf', colore: '#43A047' },
    { nome: 'Accessi giornalieri', icona: 'calendar_month', colore: '#29B6F6' }
  ];
  sfide = [
    { nome: 'Bollette in tempo', completata: true },
    { nome: 'Consumo consapevole', completata: true },
    { nome: 'Esplora e scopri', completata: false }
  ];
  premio = 'Hai sbloccato uno sconto del 10 % sulle prossime bollette!';
}
