import { Fornitore } from './fornitore.model';

export interface Offerta {
  vantaggi?: string;
  idOfferta: number;
  descrizione: string;
  dataInizio: string;
  dataFine: string;
  importo: number;
  tipo: string;
  durataMese: number;
  fornitore: Fornitore;
  risparmioAnnuale?: number;
}
