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
import { Bolletta } from '../../dto/bolletta.model';
import { HttpClient } from '@angular/common/http';
import { Offerta } from '../../dto/offerta.model';
import { OffertaService } from '../../service/offerta.service';
import { PagamentoPopupComponent } from '../pagamento-popup/pagamento-popup.component';


declare var google: any;

@Component({
  selector: 'app-statistiche',
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
  templateUrl: './statistiche.component.html',
  styleUrls: ['./statistiche.component.scss']
})
export class StatisticheComponent implements OnInit {
  dataInizio: string = '';
  dataFine: string = '';
  bollettePagate: Bolletta[] = [];
  categoriaSpese: { [key: string]: number } = {};
  totale: number = 0;
  periodoSelezionato: string = '3';
  spesaMedia: number = 0;
  tipologie: string[] = ['Gas', 'Luce', 'WiFi'];
  chartInstance: any;

  constructor(private bollettaService: BollettaService, private http: HttpClient) {}

  ngOnInit() {
    this.loadGoogleCharts();
    this.aggiornaStatistiche();
  }

  loadGoogleCharts() {
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.onload = () => {
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => {
          this.aggiornaGraficoLinea();
        });
      };
      document.head.appendChild(script);
    } else {
      google.charts.load('current', { packages: ['corechart'] });
      google.charts.setOnLoadCallback(() => {
        this.aggiornaGraficoLinea();
      });
    }
  }

  onPeriodoChange() {
    this.aggiornaStatistiche();
  }

  aggiornaStatistiche() {
    const currentUser = localStorage.getItem('utente');
    if (!currentUser) {
      this.bollettePagate = [];
      this.categoriaSpese = {};
      this.totale = 0;
      this.spesaMedia = 0;
      return;
    }
    const user = JSON.parse(currentUser);
    const cf = user.cf;
    // Calcola data inizio/fine in base al periodo selezionato
    let dataFine = new Date();
    let dataInizio = new Date();
    if (this.periodoSelezionato !== 'max') {
      dataInizio.setMonth(dataFine.getMonth() - parseInt(this.periodoSelezionato));
    } else {
      dataInizio = new Date(2000, 0, 1); // Data minima
    }
    // Conversione data in formato YYYY-MM-DD
    const formatDate = (d: any) => {
      if (!d) return '';
      const dateObj = typeof d === 'string' ? new Date(d) : d;
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const dataInizioStr = formatDate(dataInizio);
    const dataFineStr = formatDate(dataFine);
    this.http.get<any>(`/api/bollette/statistiche`, {
      params: {
        cf,
        dataInizio: dataInizioStr,
        dataFine: dataFineStr
      }
    }).subscribe(res => {
      this.bollettePagate = res.bollettePagate;
      this.categoriaSpese = res.spesePerTipologia;
      this.totale = res.totale;
      this.spesaMedia = this.bollettePagate.length > 0 ? this.totale / this.bollettePagate.length : 0;
      this.aggiornaGraficoTorta();
      this.aggiornaGraficoLinea();
    });
  }

  aggiornaGraficoTorta() {
    // Calcola le percentuali e aggiorna il CSS del grafico a torta
    const gas = this.categoriaSpese['Gas'] || 0;
    const luce = this.categoriaSpese['Luce'] || 0;
    const wifi = this.categoriaSpese['WiFi'] || 0;
    const totale = this.totale || 1;
    const gasPerc = Math.round((gas / totale) * 360);
    const lucePerc = Math.round((luce / totale) * 360);
    const wifiPerc = 360 - gasPerc - lucePerc;
    const pieChart = document.querySelector('.pie-chart') as HTMLElement;
    if (pieChart) {
      pieChart.style.background = `conic-gradient(
        #ff6b35 0deg ${gasPerc}deg,
        #f7931e ${gasPerc}deg ${gasPerc + lucePerc}deg,
        #4caf50 ${gasPerc + lucePerc}deg 360deg
      )`;
    }
  }

  aggiornaGraficoLinea() {
    if (!(window as any).google || !google.visualization) return;
    const tipi = ['Gas', 'Luce', 'WiFi'];
    const allDates = Array.from(new Set(
      this.bollettePagate
        .filter(b => b.dataPagamento !== undefined && b.dataPagamento !== null)
        .map(b => {
          if (b.dataPagamento instanceof Date) {
            return b.dataPagamento.toISOString().slice(0, 10);
          }
          if (typeof b.dataPagamento === 'string') {
            return b.dataPagamento;
          }
          return '';
        })
    )).filter(date => date !== '').sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const header = ['Data', ...tipi];
    const rows = allDates.map(date => {
      const values = tipi.map(tipo => {
        const found = this.bollettePagate.find(b => b.tipologia === tipo && (
          b.dataPagamento !== undefined && b.dataPagamento !== null &&
          ((b.dataPagamento instanceof Date ? b.dataPagamento.toISOString().slice(0, 10) : typeof b.dataPagamento === 'string' ? b.dataPagamento : '') === date)
        ));
        return found ? found.importo || 0 : null;
      });
      return [new Date(date), ...values];
    });
    const data = google.visualization.arrayToDataTable([
      header,
      ...rows
    ]);
    const options = {
      title: 'Andamento dei costi domestici',
      titleTextStyle: {
        fontSize: 28,
        fontName: 'Inter',
        bold: true,
        color: '#222',
        italic: false
      },
      hAxis: {
        title: '',
        format: 'dd/MM/yyyy',
        textStyle: { fontSize: 16, color: '#222', fontName: 'Inter' },
        gridlines: { color: '#e9ecef', count: allDates.length },
        baselineColor: '#e9ecef',
        slantedText: true,
        slantedTextAngle: 30
      },
      vAxis: {
        title: 'Costi in €',
        titleTextStyle: { fontSize: 18, color: '#222', fontName: 'Inter' },
        textStyle: { fontSize: 16, color: '#222', fontName: 'Inter' },
        gridlines: { color: '#e9ecef' },
        baselineColor: '#e9ecef',
        minValue: 0,
        maxValue: 800
      },
      legend: {
        position: 'top',
        alignment: 'center',
        textStyle: { fontSize: 18, color: '#222', fontName: 'Inter' }
      },
      colors: ['#1976d2', '#fbc02d', '#43a047'],
      pointSize: 8,
      lineWidth: 4,
      chartArea: { left: 80, top: 80, width: '80%', height: '70%' },
      backgroundColor: '#fff',
      fontName: 'Inter',
      fontSize: 16,
      tooltip: { isHtml: true },
      annotations: {
        textStyle: {
          fontSize: 16,
          color: '#222',
          fontName: 'Inter',
          bold: true
        }
      },
      interpolateNulls: true
    };
    const chart = new google.visualization.LineChart(document.getElementById('googleLineChart'));
    chart.draw(data, options);
  }

  onFiltroChange() {
    this.aggiornaStatistiche();
  }

  getPercent(tipologia: string): number {
    const value = this.categoriaSpese[tipologia] || 0;
    return this.totale > 0 ? Math.round((value / this.totale) * 100) : 0;
  }

  getSpesaMediaTipologia(tipologia: string): number {
    const bolletteTipo = this.bollettePagate.filter(b => b.tipologia === tipologia);
    if (bolletteTipo.length === 0) return 0;
    const totaleTipo = bolletteTipo.reduce((sum, b) => sum + (b.importo || 0), 0);
    return totaleTipo / bolletteTipo.length;
  }
}
