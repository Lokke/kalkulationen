# Kalkulationstrainer

Interaktiver Trainer für deutsche Handelskalkulation (Vor- und Rückwärtskalkulation).

## Features

- **Flexibler Startwert**: Vorgegebene Startpunkte (LEP, LVP, BVP2) oder beliebiger Wert mit Position
- **3 Übungsmodi**:
  - Tabelle anordnen + Rechenzeichen wählen
  - Nur Rechenzeichen wählen
  - Vollständig (in Entwicklung)
- **🎓 Prüfungsmodus**: Textaufgabe mit 5-8 Werten, unsortierte Tabelle, vollständige Eigenbearbeitung
- **Drag & Drop**: Zeilen in richtige Reihenfolge bringen
- **Pfeil-Buttons**: Alternative - Zeilen mit Pfeilen verschieben
- **Rechenzeichen-Buttons**: +, −, = per Klick
- **Preis-Berechnung**: Ein Preis vorgegeben, andere berechnen
- **Formel-Eingabe**: Berechnungsformel (z.B. `450×20÷100`)
  - **Automatische Preis-Berechnung**: Formel-Eingabe füllt Preis-Feld automatisch
  - **💡 Formel-Hilfe**: Button zeigt korrekte Beispiel-Formel und kann übernommen werden
- **Zeile-für-Zeile Prüfung**: Während Bearbeitung prüfbar (Blur-Event)
- **Fehlerkorrektur**: Nach Prüfung Fehler sehen und korrigieren
- **Validierung**:
  - Positions-Check (falsche Zeilen rot)
  - Rechenzeichen-Check (grün/rot)
  - Preis-Check (±0,01€ Toleranz)
  - **Formel-Check durch Ergebnis**: Berechnetes Ergebnis wird geprüft, nicht Syntax
- **Lexikon**: Erklärungen zu jedem Kalkulationsschritt
  - Definitionen zu allen 18 Schritten
  - Formeln (Vorwärts- und Rückwärtskalkulation)
  - Beispiele
  - Unterschiede zwischen Kalkulationsarten
- **Vorgeordnete Tabelle**: Option mit sortierter Tabelle
- **Dynamische Werte**: Neue Zufallswerte pro Aufgabe
- **Kompaktes Design**: Darstellung aller 18 Kalkulationsschritte

## Kalkulationsschema

18 Schritte der Handelskalkulation:

1. **LEP** - Listeneinkaufspreis
2. **LR** - Lieferantenrabatt
3. **ZEP** - Zieleinkaufspreis
4. **LSK** - Lieferantenskonto
5. **BEK** - Bareinkaufspreis
6. **BK** - Bezugskosten
7. **BP** - Bezugspreis (= 100% Basis)
8. **HKz** - Handlungskostenzuschlag
9. **SKP** - Selbstkostenpreis
10. **Gz** - Gewinnzuschlag
11. **BVP** - Barverkaufspreis
12. **Ksk** - Kundenskonto
13. **VP** - Vertreterprovision
14. **ZVP** - Zielverkaufspreis
15. **KR** - Kundenrabatt
16. **LVP** - Listenverkaufspreis
17. **USt** - Umsatzsteuer (19%)
18. **BVP2** - Bruttoverkaufspreis

## Verwendung

### 1. Startwert wählen

Wähle aus vier Optionen:

- **LEP** (Vorwärtskalkulation vom Einkauf)
- **LVP** (Rückwärtskalkulation vom Verkauf)
- **BVP2** (Rückwärtskalkulation vom Endpreis)
- **Benutzerdefiniert**:
  - Beliebiger Wert in Euro
  - Startposition wählbar (z.B. BP, SKP)
  - Für spezielle Übungsszenarien

### 2. Übungsoptionen

- **"Tabelle bereits angeordnet"**:
  - Aktiviert: Rechenzeichen und Berechnungen üben
  - Deaktiviert: Drag & Drop-Übung inklusive

- **🎓 "Prüfungsmodus"**:
  - Aktiviert: Textaufgabe mit 5-8 Parametern
  - Unsortierte Tabelle
  - Nur ein logischer Startwert (= Position)
  - Vollständige Eigenbearbeitung erforderlich
  - Lexikon deaktiviert

### 3. Aufgabe bearbeiten

1. **Tabelle anordnen** (wenn nicht vorgeordnet): Zeilen ziehen oder Pfeile nutzen
2. **Rechenzeichen wählen**: +, − oder = klicken
3. **Preise berechnen**: Berechnete Preise eintragen (ein Preis vorgegeben)
4. **Formeln eingeben**: Berechnungsschritte dokumentieren
   - Beispiel: `450×20÷100` oder `450*20/100`
   - **Formel füllt Preis-Feld automatisch**
   - **💡 Hilfe-Button**: Zeigt korrekte Formel mit Erklärung
   - **Ergebnis** wird geprüft, nicht Schreibweise
   - × oder *, ÷ oder / verwendbar
   - Komma oder Punkt für Dezimalzahlen
5. **Zeile-für-Zeile prüfen**: Felder verlassen (Blur) prüft automatisch
   - Grün = Richtig, Rot = Falsch
   - Korrektur jederzeit möglich

### 4. Lösung prüfen

**"Lösung prüfen"** für Feedback:

- Grün = Richtig
- Rot = Falsch
- Falsch angeordnete Zeilen: roter Hintergrund
- **Nach Prüfung**: Fehler sehen und korrigieren

### 5. Lexikon nutzen

**"Lexikon"** öffnen für:

- Erklärungen zu jedem Kalkulationsschritt
- Formeln für Vor- und Rückwärtskalkulation
- Beispiele mit Zahlen
- Anwendungsfälle der Kalkulationsarten

## Tipps & Tricks

- **Prozentsätze**: Skonto 1-4%, andere variieren je nach Bereich
- **Bezugskosten (BK)**: Position ohne Prozentsatz (Festbetrag)
- **Zwischensummen (=)**: LEP, ZEP, BEK, BP, SKP, BVP, ZVP, LVP, BVP2
- **Toleranz**: Preise ±0,01€ genau
- **Formeln**:
  - Ergebnis muss stimmen, nicht Schreibweise
  - `500*0.2` = `500×20÷100` = `500×0,2` (korrekt bei Ergebnis = 100)
  - Formel-Eingabe füllt Preis automatisch
  - 💡 Hilfe-Button zeigt korrekte Formel
- **Zeilen-Prüfung**: Während Eingabe prüfbar (beim Feld-Verlassen)
- **Lexikon**: Bei Unsicherheiten öffnen für Erklärungen und Beispiele
- **Prüfungsmodus**: Realistische Textaufgaben mit Alltagsszen arien
- **Benutzerdefinierter Start**: Für:
  - Gezielte Übung einzelner Kalkulationsabschnitte
  - Nachrechnen realer Beispiele aus Lehrbüchern
  - Fokus auf schwierige Bereiche

## Installation & Start

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Produktion
npm run build
```

### Docker

```bash
# Image bauen
docker build -t kalkulationen:latest .

# Container starten
docker run -d -p 6333:6333 --name kalkulationen kalkulationen:latest

# App öffnen: http://localhost:6333
```

Siehe [DOCKER.md](DOCKER.md) für Details.

## Technologie

- **Vite 7.1.12** - Build-Tool
- **TypeScript** - Type Safety
- **Vanilla JavaScript** - Keine Frameworks
- **CSS3** - Styling mit Gradients, Animationen, 3D-Effekte

## Hintergrund: Handelskalkulation

### Vorwärtskalkulation

Startet mit **Einkaufspreis** (LEP), berechnet **Verkaufspreis**.  
**Frage**: "Was muss ich verlangen, um Kosten und Gewinn zu decken?"

### Rückwärtskalkulation

Startet mit **Verkaufspreis** (LVP/BVP2), berechnet maximalen **Einkaufspreis**.  
**Frage**: "Was darf das Produkt maximal kosten bei gegebenem Verkaufspreis?"

### Differenzkalkulation

Vergleich zwischen Einkaufs- und Verkaufspreis zur Gewinnermittlung.

## Zukünftige Erweiterungen

- Statistiken und Lernfortschritt
- Zeitbegrenzung für Geschwindigkeitstraining
- Zusätzliche Übungsszenarien (z.B. Kalkulationszuschlag berechnen)
