// ...existing code...
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../service/auth.service';
import { Utente } from '../../dto/auth.model'; // importa il modello utente
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-gamification',
  standalone: true,
  imports: [MatToolbarModule, CommonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule],
  templateUrl: './gamification.component.html',
  styleUrls: ['./gamification.component.scss']
})

export class GamificationComponent {
  livello = 0;
  percentualeCompletamento = 0;
  punti = 0;
  sconto = 0;
  classifica: Utente[] = [];

  constructor(
    private utenteService: AuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  get showHrFlow(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user || !user.mail) return false;
    return user.mail.toLowerCase().endsWith('@hrflow.it');
  }

  ngOnInit() {
    // Recupera l'utente dal localStorage
    const utenteLocal = this.utenteService.getCurrentUser();
    const cf = utenteLocal?.cf ?? '';
    if (cf) {
      this.utenteService.getUtenteByCf(cf).subscribe((utente: Utente) => {
        this.punti = utente.punti ?? 0;
        const res = this.getLivelloEPercentuale(this.punti);
        this.livello = res.livello;
        this.percentualeCompletamento = res.percentuale;
        
        // Calcola lo sconto direttamente dal livello (1% per livello)
        this.sconto = this.getScontoPercentuale();
      });
    }
      // Recupera la classifica utenti
      this.utenteService.getClassificaUtenti().subscribe((utenti: Utente[]) => {
        this.classifica = utenti;
      });
  }

  getUsername(): string {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // Calcola i punti totali necessari per raggiungere un determinato livello
  // Sistema fisso: 50 punti per ogni livello (Livello 1: 50, Livello 2: 100, Livello 3: 150, ecc.)
  getPuntiPerLivello(livello: number): number {
    return livello * 50;
  }

  // Calcola il livello attuale basato sui punti posseduti
  calcolaLivelloAttuale(punti: number): number {
    let livello = 0;
    while (this.getPuntiPerLivello(livello + 1) <= punti) {
      livello++;
    }
    return livello;
  }

  getLivelloEPercentuale(punti: number): { livello: number, percentuale: number } {
    const livello = this.calcolaLivelloAttuale(punti);
    
    // Punti necessari per il livello attuale e il prossimo
    const puntiLivelloAttuale = this.getPuntiPerLivello(livello);
    const puntiProssimoLivello = this.getPuntiPerLivello(livello + 1);
    
    // Punti nel livello corrente e punti necessari per completarlo
    const puntiNelLivello = punti - puntiLivelloAttuale;
    const puntiNecessariPerLivello = puntiProssimoLivello - puntiLivelloAttuale;
    
    // Percentuale di completamento verso il prossimo livello
    const percentuale = (puntiNelLivello / puntiNecessariPerLivello) * 100;

    console.log(`Punti: ${punti}, Livello: ${livello}, Percentuale completamento: ${percentuale.toFixed(1)}%`);
    console.log(`Punti per livello ${livello}: ${puntiLivelloAttuale}, Punti per livello ${livello + 1}: ${puntiProssimoLivello}`);

    return { livello, percentuale };
  }

  // Calcola lo sconto basato sul livello (1% per livello, massimo 70%)
  getScontoPercentuale(): number {
    return Math.min(this.livello, 70); // Massimo 70% di sconto
  }

  // Funzione helper per ottenere i punti necessari per il prossimo livello
  getPuntiPerProssimoLivello(): number {
    const puntiAttualeLivello = this.getPuntiPerLivello(this.livello);
    const puntiProssimoLivello = this.getPuntiPerLivello(this.livello + 1);
    return puntiProssimoLivello - this.punti;
  }

  // Funzione helper per ottenere quanti punti servono per completare il livello attuale
  getPuntiNelLivelloCorrente(): number {
    const puntiAttualeLivello = this.getPuntiPerLivello(this.livello);
    return this.punti - puntiAttualeLivello;
  }

  // Funzione helper per ottenere quanti punti servono in totale per il livello corrente
  getPuntiTotaliLivelloCorrente(): number {
    const puntiAttualeLivello = this.getPuntiPerLivello(this.livello);
    const puntiProssimoLivello = this.getPuntiPerLivello(this.livello + 1);
    return puntiProssimoLivello - puntiAttualeLivello;
  }
}
