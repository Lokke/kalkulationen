export type Operation = '+' | '-' | '=';

export interface KalkulationsZeile {
  id: number;
  operation: Operation | '';
  abkuerzung: string;
  name: string;
  prozent: number | null;
  preis: number | null;
  userPreis: string; // User-Eingabe als String
  userFormel: string; // User-Eingabe Formel
  formel: string;
  isFixed: boolean; // Wird vorgegeben
  originalOrder: number; // Ursprüngliche Reihenfolge
}

export interface KalkulationsEinstellungen {
  startWertTyp: 'LEP' | 'LVP' | 'BVP2' | 'CUSTOM';
  startWertCustom?: number;
  startPositionIndex?: number;
  tabelleVorgeordnet: boolean;
  pruefungsModus: boolean;
}

export interface TextAufgabe {
  text: string;
  startwert: number;
  startPosition: number;
  werte: Map<string, number>; // abkuerzung -> wert (prozent oder festbetrag)
}

export interface KalkulationsSchema {
  abkuerzung: string;
  name: string;
  operation: Operation | '';
  prozentRange?: [number, number]; // Min/Max für Prozentsatz
  isSkonto?: boolean; // Skonto 1-4%
}

export const kalkulationsSchemaTemplate: KalkulationsSchema[] = [
  { abkuerzung: 'LEP', name: 'Listeneinkaufspreis', operation: '' },
  { abkuerzung: 'LR', name: 'Lieferantenrabatt', operation: '-', prozentRange: [10, 30] },
  { abkuerzung: 'ZEP', name: 'Zieleinkaufspreis', operation: '=' },
  { abkuerzung: 'LSK', name: 'Lieferantenskonto', operation: '-', isSkonto: true },
  { abkuerzung: 'BEK', name: 'Bareinkaufspreis', operation: '=' },
  { abkuerzung: 'BK', name: 'Bezugskosten', operation: '+' },
  { abkuerzung: 'BP', name: 'Bezugspreis', operation: '=' },
  { abkuerzung: 'HKz', name: 'Handlungskostenzuschlag', operation: '+', prozentRange: [25, 40] },
  { abkuerzung: 'SKP', name: 'Selbstkostenpreis', operation: '=' },
  { abkuerzung: 'Gz', name: 'Gewinnzuschlag', operation: '+', prozentRange: [10, 25] },
  { abkuerzung: 'BVP', name: 'Barverkaufspreis', operation: '=' },
  { abkuerzung: 'Ksk', name: 'Kundenskonto', operation: '+', isSkonto: true },
  { abkuerzung: 'VP', name: 'Vertreterprovision', operation: '+', prozentRange: [3, 8] },
  { abkuerzung: 'ZVP', name: 'Zielverkaufspreis', operation: '=' },
  { abkuerzung: 'KR', name: 'Kundenrabatt', operation: '+', prozentRange: [5, 15] },
  { abkuerzung: 'LVP', name: 'Listenverkaufspreis', operation: '=' },
  { abkuerzung: 'USt', name: 'Umsatzsteuer', operation: '+', prozentRange: [19, 19] },
  { abkuerzung: 'BVP2', name: 'Bruttoverkaufspreis', operation: '=' },
];
