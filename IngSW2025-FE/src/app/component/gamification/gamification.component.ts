import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gamification',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div style="background: white; min-height: 80vh;">
      <div style="display: flex; align-items: center; justify-content: center; margin-top: 40px;">
        <span class="material-icons" style="margin-right: 16px; font-size: 2.5rem; color: #283593; vertical-align: middle;">
          sports_esports
        </span>
        <h1 style="color: #111; font-size: 2.5rem; font-weight: 700; text-align: center; margin: 0;">Gamification</h1>
      </div>
      <div style="max-width: 600px; margin: 32px auto 0 auto; font-size: 1.15rem; color: #222; text-align: left; line-height: 1.6;">
        La gamification trasforma la gestione delle bollette in un’esperienza più coinvolgente e motivante. Ogni azione virtuosa come pagare puntualmente, ridurre i consumi o effettuare accessi giornalieri — ti permette di guadagnare badge, punti e salire di livello.<br><br>
        <span style="display: block; margin-bottom: 10px;">
          🔹 <b>Badge:</b> Riconoscimenti per i tuoi traguardi (es. puntualità, risparmio, accessi)
        </span>
        <span style="display: block; margin-bottom: 10px;">
          🔹 <b>Punti MyBills:</b> Accumulabili e visibili nel tuo profilo
        </span>
        <span style="display: block; margin-bottom: 10px;">
          🔹 <b>Sfide mensili:</b> Obiettivi da completare ogni mese per ottenere premi virtuali
        </span>
        <span style="display: block; margin-bottom: 10px;">
          🔹 <b>Livelli utente:</b> Più badge ottieni, più sali di livello e sblocchi vantaggi e sconti
        </span>
      </div>
    </div>
  `
})
export class GamificationComponent {}
