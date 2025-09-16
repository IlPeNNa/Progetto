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

        this.utenteService.getScontoUtente(cf).subscribe(sconto => {
          this.sconto = sconto;
        });
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
