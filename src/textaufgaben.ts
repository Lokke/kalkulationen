import type { TextAufgabe } from './types';
import { kalkulationsSchemaTemplate } from './types';

// Textaufgaben-Generator basierend auf realen Szenarien
export function generiereTextaufgabe(typ: 'vorwaerts' | 'rueckwaerts'): TextAufgabe {
  const szenarien = [
    {
      kontext: 'Sportgerätegroßhandel',
      produkt: 'Surfbrett',
      artikel: 'das Surfbrett',
      preisRangeLEP: [180, 350],
      preisRangeLVP: [420, 680],
      preisRangeBVP2: [500, 810],
    },
    {
      kontext: 'Funkwecker-Großhandel',
      produkt: 'Funkwecker',
      artikel: 'den Wecker',
      preisRangeLEP: [12, 25],
      preisRangeLVP: [28, 48],
      preisRangeBVP2: [33, 57],
    },
    {
      kontext: 'Möbelgroßhandel',
      produkt: 'Relaxliegen-Sortiment',
      artikel: 'das Sortiment',
      preisRangeLEP: [3500, 6000],
      preisRangeLVP: [7800, 12500],
      preisRangeBVP2: [9300, 14900],
    },
    {
      kontext: 'Baumarkt',
      produkt: 'Holzbearbeitungsmaschine',
      artikel: 'die Holzbearbeitungsmaschine',
      preisRangeLEP: [1200, 2200],
      preisRangeLVP: [2400, 4200],
      preisRangeBVP2: [2860, 5000],
    },
    {
      kontext: 'Sportgeschäft',
      produkt: 'Paar Sneakers',
      artikel: 'ein Paar Sneakers',
      preisRangeLEP: [45, 85],
      preisRangeLVP: [95, 165],
      preisRangeBVP2: [113, 196],
    },
    {
      kontext: 'Elektronikgroßhandel',
      produkt: 'Tablet',
      artikel: 'das Tablet',
      preisRangeLEP: [150, 320],
      preisRangeLVP: [320, 610],
      preisRangeBVP2: [380, 726],
    },
    {
      kontext: 'Textilgroßhandel',
      produkt: 'Winterjacken-Kollektion',
      artikel: 'die Winterjacken-Kollektion',
      preisRangeLEP: [2800, 4500],
      preisRangeLVP: [5900, 9200],
      preisRangeBVP2: [7020, 10948],
    },
    {
      kontext: 'Getränkegroßhandel',
      produkt: 'Kiste Mineralwasser',
      artikel: 'eine Kiste Mineralwasser',
      preisRangeLEP: [4.50, 7.20],
      preisRangeLVP: [9.80, 14.50],
      preisRangeBVP2: [11.66, 17.26],
    },
    {
      kontext: 'Bürobedarfshandel',
      produkt: 'Bürostuhl-Set',
      artikel: 'das Bürostuhl-Set',
      preisRangeLEP: [890, 1450],
      preisRangeLVP: [1850, 2980],
      preisRangeBVP2: [2202, 3546],
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
    startwert = Math.round((szenario.preisRangeLEP[0] + Math.random() * (szenario.preisRangeLEP[1] - szenario.preisRangeLEP[0])) * 100) / 100;
    
    text = `Ein ${szenario.kontext} kann ${szenario.artikel} zu einem Listeneinkaufspreis von ${startwert.toFixed(2)} € einkaufen. Berechnen Sie den Bruttoverkaufspreis, wenn folgende Kalkulationssätze gelten:\n\n`;
    
  } else {
    // Rückwärtskalkulation: Start bei LVP oder BVP2
    const startTyp = Math.random() > 0.5 ? 'LVP' : 'BVP2';
    startPosition = kalkulationsSchemaTemplate.findIndex(s => s.abkuerzung === startTyp);
    
    if (startTyp === 'BVP2') {
      startwert = Math.round((szenario.preisRangeBVP2[0] + Math.random() * (szenario.preisRangeBVP2[1] - szenario.preisRangeBVP2[0])) * 100) / 100;
      text = `Ein ${szenario.kontext} möchte ${szenario.artikel} für ${startwert.toFixed(2)} € brutto verkaufen. Berechnen Sie den maximal zulässigen Listeneinkaufspreis, wenn folgende Kalkulationssätze gelten:\n\n`;
    } else {
      startwert = Math.round((szenario.preisRangeLVP[0] + Math.random() * (szenario.preisRangeLVP[1] - szenario.preisRangeLVP[0])) * 100) / 100;
      text = `Ein ${szenario.kontext} hat ${szenario.artikel} zu einem Listenverkaufspreis von ${startwert.toFixed(2)} € (netto) kalkuliert. Berechnen Sie den maximal zulässigen Listeneinkaufspreis, wenn folgende Kalkulationssätze gelten:\n\n`;
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
