export interface Bolletta {
  // Proprietà del backend (nomi Java/database)
  idBolletta?: number;
  scadenza: Date;
  importo: number;
  tipologia: string;
  dataPagamento?: Date;
  idOfferta?: number;
  dFornitore?: number;
  cf?: string;
  
  // Proprietà frontend per compatibilità con il componente esistente
  id?: string;                 // Mappato da idBolletta
  tipo?: string;              // Mappato da tipologia  
  fornitore?: string;         // Mappato da dFornitore (da recuperare)
  pagato?: boolean;           // Calcolato da dataPagamento != null
}

export enum TipoBolletta {
  GAS = 'Gas',
  LUCE = 'Luce',
  WIFI = 'WiFi'
}

export interface StatisticheCliente {
  gas: number;
  luce: number;
  wifi: number;
}