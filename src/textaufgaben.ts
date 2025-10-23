import type { TextAufgabe } from './types';
import { kalkulationsSchemaTemplate } from './types';

// Textaufgaben-Generator basierend auf realen Szenarien
export function generiereTextaufgabe(typ: 'vorwaerts' | 'rueckwaerts'): TextAufgabe {
  const szenarien = [
    {
      // Sportgerätegroßhandel
      kontext: 'Sportgerätegroßhandel',
      produkt: 'Surfbrett',
      artikel: 'das Surfbrett',
      preisRange: [1500, 3000],
    },
    {
      kontext: 'Funkwecker-Großhandel',
      produkt: 'Funkwecker',
      artikel: 'den Wecker',
      preisRange: [15, 35],
    },
    {
      kontext: 'Möbelgroßhandel',
      produkt: 'Relaxliegen-Sortiment',
      artikel: 'das Sortiment',
      preisRange: [8000, 15000],
    },
    {
      kontext: 'Baumarkt',
      produkt: 'Holzoberfläche',
      artikel: 'die Holzoberfläche',
      preisRange: [200, 400],
    },
    {
      kontext: 'Sportgeschäft',
      produkt: 'Paar Sneakers',
      artikel: 'ein Paar Sneakers',
      preisRange: [100, 200],
    },
    {
      kontext: 'Elektronikgroßhandel',
      produkt: 'Tablet',
      artikel: 'das Tablet',
      preisRange: [250, 600],
    },
    {
      kontext: 'Textilgroßhandel',
      produkt: 'Winterjacke',
      artikel: 'die Winterjacke',
      preisRange: [60, 150],
    },
  ];

  const szenario = szenarien[Math.floor(Math.random() * szenarien.length)];
  
  // Zufällige Werte generieren (5-8 Angaben)
  const anzahlWerte = 5 + Math.floor(Math.random() * 4); // 5-8
  const werte = new Map<string, number>();
  
  let startPosition: number;
  let startwert: number;
  let text = '';

  if (typ === 'vorwaerts') {
    // Vorwärtskalkulation: Start bei LEP
    startPosition = 0; // LEP
    startwert = Math.round((szenario.preisRange[0] + Math.random() * (szenario.preisRange[1] - szenario.preisRange[0])) * 100) / 100;
    
    text = `Unser ${szenario.kontext} hat erfahren, dass die Konkurrenz ein bestimmtes ${szenario.produkt} zum Nettoverkaufspreis von ${startwert.toFixed(2)} € anbietet. Um keine Kunden zu verlieren, möchten wir ${szenario.artikel} ebenfalls zu diesem Verkaufspreis anpassen. Wir möchten jedoch unsere kalkulierte Gewinnspanne sowie die restlichen Kalkulationssätze beibehalten. Zu welchem Einkaufspreis können wir ${szenario.artikel} maximal einkaufen, wenn folgende Größen gelten:\n\n`;
    
  } else {
    // Rückwärtskalkulation: Start bei LVP oder BVP2
    const startTyp = Math.random() > 0.5 ? 'LVP' : 'BVP2';
    startPosition = kalkulationsSchemaTemplate.findIndex(s => s.abkuerzung === startTyp);
    startwert = Math.round((szenario.preisRange[0] + Math.random() * (szenario.preisRange[1] - szenario.preisRange[0])) * 100) / 100;
    
    if (startTyp === 'BVP2') {
      text = `Ein ${szenario.kontext} möchte ${szenario.artikel} für ${startwert.toFixed(2)} € brutto verkaufen. Wir gewähren unseren Kunden einen Rabatt und einen Skonto. Wir kalkulieren mit einem Gewinn und einem Handlungskostensatz. Der Lieferant berechnet uns keine Bezugskosten. Der Lieferer gewährt uns einen Skonto und einen Rabatt. Welchen Einkaufspreis darf ${szenario.artikel} höchstens kosten, wenn folgende Kalkulationssätze gelten:\n\n`;
    } else {
      text = `Ein ${szenario.kontext} hat einen vom Hersteller empfohlenen Richtpreis von ${startwert.toFixed(2)} € (netto) erhalten. Wir möchten ${szenario.artikel} zu diesem Verkaufspreis anbieten. Welchen Einkaufspreis darf der Händler höchstens kalkulieren, wenn folgende Kalkulationssätze gelten:\n\n`;
    }
  }

  // Werte zufällig auswählen und Text generieren
  const ausgewaehltePositionen: string[] = [];
  const schema = [...kalkulationsSchemaTemplate];
  
  // Wähle zufällige Positionen aus (außer Startwert)
  schema.forEach((pos, idx) => {
    if (idx === startPosition) return; // Startwert überspringen
    if (ausgewaehltePositionen.length >= anzahlWerte) return;
    
    if (Math.random() > 0.4) { // 60% Chance
      ausgewaehltePositionen.push(pos.abkuerzung);
      
      let wert: number;
      if (pos.abkuerzung === 'BK') {
        // Bezugskosten als Festbetrag
        wert = Math.round((3 + Math.random() * 20) * 100) / 100;
        werte.set(pos.abkuerzung, wert);
        text += `• ${pos.name}: ${wert.toFixed(2)} €\n`;
      } else if (pos.prozentRange) {
        // Prozentsatz
        wert = Math.round((pos.prozentRange[0] + Math.random() * (pos.prozentRange[1] - pos.prozentRange[0])) * 100) / 100;
        werte.set(pos.abkuerzung, wert);
        text += `• ${pos.name}: ${wert} %\n`;
      }
    }
  });

  // Falls zu wenige Werte, auffüllen
  while (ausgewaehltePositionen.length < anzahlWerte) {
    const pos = schema[Math.floor(Math.random() * schema.length)];
    if (ausgewaehltePositionen.includes(pos.abkuerzung) || schema.indexOf(pos) === startPosition) continue;
    
    ausgewaehltePositionen.push(pos.abkuerzung);
    
    let wert: number;
    if (pos.abkuerzung === 'BK') {
      wert = Math.round((3 + Math.random() * 20) * 100) / 100;
      werte.set(pos.abkuerzung, wert);
      text += `• ${pos.name}: ${wert.toFixed(2)} €\n`;
    } else if (pos.prozentRange) {
      wert = Math.round((pos.prozentRange[0] + Math.random() * (pos.prozentRange[1] - pos.prozentRange[0])) * 100) / 100;
      werte.set(pos.abkuerzung, wert);
      text += `• ${pos.name}: ${wert} %\n`;
    }
  }

  return {
    text,
    startwert,
    startPosition,
    werte,
  };
}
