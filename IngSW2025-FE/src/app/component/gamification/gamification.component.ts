// ...existing code...
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../service/auth.service'; // importa il servizio
import { Utente } from '../../dto/auth.model'; // importa il modello utente
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-gamification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule],
  templateUrl: './gamification.component.html',
  styleUrls: ['./gamification.component.scss']
})

export class GamificationComponent {
  livello = 0;
  percentualeCompletamento = 0;
  punti = 0;
  sconto = 0;

  constructor(private utenteService: AuthService) {}

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

        this.utenteService.getScontoUtente(cf).subscribe(sconto => {
          this.sconto = sconto;
        });
      });
    }
  }

  getLivelloEPercentuale(punti: number): { livello: number, percentuale: number } {
    let livello = 0;
    let percentuale = 0;

    if (punti < 10) {
      livello = 0;
      percentuale = punti * 10;
    } else if (punti < 100) {
      livello = Math.floor(punti / 10);
      percentuale = (punti % 10) * 10;
    } else {
      livello = Math.floor(punti / 10);
      percentuale = (punti % 10) * 10;
    }

    console.log(`Livello: ${livello}, Percentuale: ${percentuale}`);

    return { livello, percentuale };
  }
}