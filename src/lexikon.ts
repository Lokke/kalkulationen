export interface LexikonEintrag {
  titel: string;
  abkuerzung: string;
  erklaerung: string;
  formelVorwaerts?: string;
  formelRueckwaerts?: string;
  beispiel?: string;
}

export const kalkulationsLexikon: LexikonEintrag[] = [
  {
    titel: 'Listeneinkaufspreis (LEP)',
    abkuerzung: 'LEP',
    erklaerung: 'Der Preis, der in der Preisliste des Lieferanten steht, bevor Rabatte abgezogen werden.',
    beispiel: 'Ein Händler findet ein Produkt im Katalog für 500 €.'
  },
  {
    titel: 'Lieferantenrabatt (LR)',
    abkuerzung: 'LR',
    erklaerung: 'Ein prozentualer Preisnachlass, den der Lieferant dem Händler gewährt (oft Mengenrabatt).',
    formelVorwaerts: 'LEP × LR% ÷ 100',
    formelRueckwaerts: 'ZEP ÷ (100 - LR%) × 100',
    beispiel: 'Bei 20% Rabatt auf 500 €: 500 × 20 ÷ 100 = 100 €'
  },
  {
    titel: 'Zieleinkaufspreis (ZEP)',
    abkuerzung: 'ZEP',
    erklaerung: 'Der Preis nach Abzug des Lieferantenrabatts. "Ziel" bedeutet: Zahlung auf Ziel (später).',
    formelVorwaerts: 'LEP - LR',
    beispiel: '500 € - 100 € = 400 €'
  },
  {
    titel: 'Lieferantenskonto (LSK)',
    abkuerzung: 'LSK',
    erklaerung: 'Ein Preisnachlass für sofortige Zahlung (meist 1-4%). Anreiz für schnelle Bezahlung.',
    formelVorwaerts: 'ZEP × LSK% ÷ 100',
    formelRueckwaerts: 'BEK ÷ (100 - LSK%) × 100',
    beispiel: 'Bei 3% Skonto auf 400 €: 400 × 3 ÷ 100 = 12 €'
  },
  {
    titel: 'Bareinkaufspreis (BEK)',
    abkuerzung: 'BEK',
    erklaerung: 'Der Preis bei sofortiger Barzahlung nach Abzug von Skonto.',
    formelVorwaerts: 'ZEP - LSK',
    beispiel: '400 € - 12 € = 388 €'
  },
  {
    titel: 'Bezugskosten (BK)',
    abkuerzung: 'BK',
    erklaerung: 'Zusätzliche Kosten für Transport, Versicherung, Zoll etc.',
    beispiel: 'Versandkosten: 10 €, Versicherung: 5 € = 15 € Bezugskosten'
  },
  {
    titel: 'Bezugspreis (BP)',
    abkuerzung: 'BP',
    erklaerung: 'Die tatsächlichen Einkaufskosten inkl. aller Nebenkosten. Basis für die Kalkulation (= 100%).',
    formelVorwaerts: 'BEK + BK',
    beispiel: '388 € + 15 € = 403 €'
  },
  {
    titel: 'Handlungskostenzuschlag (HKz)',
    abkuerzung: 'HKz',
    erklaerung: 'Zuschlag für laufende Betriebskosten: Miete, Personal, Strom, Werbung etc.',
    formelVorwaerts: 'BP × HKz% ÷ 100',
    formelRueckwaerts: 'SKP ÷ (100 + HKz%) × 100',
    beispiel: 'Bei 30% auf 403 €: 403 × 30 ÷ 100 = 120,90 €'
  },
  {
    titel: 'Selbstkostenpreis (SKP)',
    abkuerzung: 'SKP',
    erklaerung: 'Alle Kosten zusammen. Unter diesem Preis darf nicht verkauft werden (langfristig).',
    formelVorwaerts: 'BP + HKz',
    beispiel: '403 € + 120,90 € = 523,90 €'
  },
  {
    titel: 'Gewinnzuschlag (Gz)',
    abkuerzung: 'Gz',
    erklaerung: 'Der gewünschte Gewinn als Prozentsatz auf die Selbstkosten.',
    formelVorwaerts: 'SKP × Gz% ÷ 100',
    formelRueckwaerts: 'BVP ÷ (100 + Gz%) × 100',
    beispiel: 'Bei 15% Gewinn auf 523,90 €: 523,90 × 15 ÷ 100 = 78,59 €'
  },
  {
    titel: 'Barverkaufspreis (BVP)',
    abkuerzung: 'BVP',
    erklaerung: 'Der Verkaufspreis bei sofortiger Barzahlung ohne Rabatte.',
    formelVorwaerts: 'SKP + Gz',
    beispiel: '523,90 € + 78,59 € = 602,49 €'
  },
  {
    titel: 'Kundenskonto (Ksk)',
    abkuerzung: 'Ksk',
    erklaerung: 'Skonto, das dem Kunden bei sofortiger Zahlung gewährt wird (meist 1-4%).',
    formelVorwaerts: 'BVP × Ksk% ÷ (100 - Ksk%)',
    formelRueckwaerts: 'ZVP × Ksk% ÷ 100',
    beispiel: 'Bei 2% auf 602,49 €: wird auf Zielverkaufspreis aufgeschlagen'
  },
  {
    titel: 'Vertreterprovision (VP)',
    abkuerzung: 'VP',
    erklaerung: 'Provision für Außendienstmitarbeiter oder Handelsvertreter.',
    formelVorwaerts: 'BVP × VP% ÷ (100 - VP%)',
    formelRueckwaerts: 'ZVP × VP% ÷ 100',
    beispiel: 'Bei 5% Provision wird diese auf den Verkaufspreis aufgeschlagen'
  },
  {
    titel: 'Zielverkaufspreis (ZVP)',
    abkuerzung: 'ZVP',
    erklaerung: 'Verkaufspreis bei späterer Zahlung, inkl. Skonto und Provision.',
    formelVorwaerts: 'BVP + Ksk + VP',
    beispiel: 'Preis bei Zahlung nach 30 Tagen'
  },
  {
    titel: 'Kundenrabatt (KR)',
    abkuerzung: 'KR',
    erklaerung: 'Rabatt für Stammkunden, Großabnehmer oder Aktionen.',
    formelVorwaerts: 'ZVP × KR% ÷ (100 - KR%)',
    formelRueckwaerts: 'LVP × KR% ÷ 100',
    beispiel: 'Bei 10% Rabatt für Stammkunden'
  },
  {
    titel: 'Listenverkaufspreis (LVP)',
    abkuerzung: 'LVP',
    erklaerung: 'Der offizielle Katalogpreis, von dem Rabatte abgezogen werden können.',
    formelVorwaerts: 'ZVP + KR',
    beispiel: 'Der Preis, der im Katalog steht'
  },
  {
    titel: 'Umsatzsteuer (USt)',
    abkuerzung: 'USt',
    erklaerung: 'Die gesetzliche Mehrwertsteuer (in Deutschland meist 19%).',
    formelVorwaerts: 'LVP × USt% ÷ 100',
    formelRueckwaerts: 'BVP ÷ (100 + USt%) × 100',
    beispiel: 'Bei 19% auf 700 €: 700 × 19 ÷ 100 = 133 €'
  },
  {
    titel: 'Bruttoverkaufspreis (BVP2)',
    abkuerzung: 'BVP2',
    erklaerung: 'Der Endpreis inkl. Umsatzsteuer, den der Endkunde zahlt.',
    formelVorwaerts: 'LVP + USt',
    beispiel: '700 € + 133 € = 833 € (Endkundenpreis)'
  }
];

export const allgemeineInfos = {
  vorwaertskalkulation: {
    titel: 'Vorwärtskalkulation',
    beschreibung: 'Bei der Vorwärtskalkulation startet man mit dem Listeneinkaufspreis (LEP) und rechnet Schritt für Schritt nach unten bis zum Bruttoverkaufspreis. Vorwärts bedeutet: von oben nach unten in der Kalkulationsvorlage. Man fragt: "Was muss ich verlangen?"',
    wann: 'Wenn der Einkaufspreis bekannt ist und der Verkaufspreis ermittelt werden soll. Ausgehend vom LEP wird berechnet, zu welchem Preis das Produkt unter Beachtung aller Bedingungen verkauft werden müsste.',
    wichtig: 'Bei der Vorwärtskalkulation rechnet man mit dem Grundwert 100 auf Basis des Bezugspreises (BP).'
  },
  rueckwaertskalkulation: {
    titel: 'Rückwärtskalkulation',
    beschreibung: 'Bei der Rückwärtskalkulation startet man mit dem (gewünschten) Verkaufspreis und rechnet rückwärts zum Einkaufspreis. Rückwärts bedeutet: von unten nach oben in der Kalkulationsvorlage. Man fragt: "Was darf es maximal kosten?"',
    wann: 'Wenn der Verkaufspreis vorgegeben ist (z.B. Marktsituation, Konkurrenzpreise) und der maximale Einkaufspreis ermittelt werden soll.',
    wichtig: 'Bei der Rückwärtskalkulation werden die Vorzeichen umgekehrt und mit verminderten/vermehrten Grundwerten gearbeitet. Z.B. bei 2% Skonto: Grundwert 98 statt 100.'
  },
  differenzkalkulation: {
    titel: 'Differenzkalkulation',
    beschreibung: 'Kombination aus Vorwärts- und Rückwärtskalkulation. Die Selbstkosten werden vorwärts vom LEP brutto berechnet, der Barverkaufspreis wird rückwärts vom LVP brutto berechnet. Die Differenz zeigt Gewinn oder Verlust.',
    wann: 'Zur Erfolgskontrolle und bei Marktpreiszwängen. Wenn sowohl Einkaufs- als auch Verkaufspreis am Markt vorgegeben sind und man prüfen will, ob sich das Geschäft lohnt.',
    berechnung: 'Gewinn/Verlust = BVP - Selbstkosten. Als Prozentsatz: (Gewinn/Verlust × 100) ÷ Selbstkosten'
  }
};
