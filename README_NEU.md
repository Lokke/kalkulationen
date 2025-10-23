# 📊 Kalkulationstrainer

Ein interaktiver Trainer für die deutsche Handelskalkulation (Vor- und Rückwärtskalkulation).

## ✨ Features

- **Flexibler Startwert**: Wähle zwischen vordefinierten Startpunkten (LEP, LVP, BVP2) oder gib einen **beliebigen Wert und Position** ein
- **3 Übungsmodi**:
  - Tabelle anordnen + Rechenzeichen wählen
  - Nur Rechenzeichen wählen
  - Vollständig (in Entwicklung)
- **Drag & Drop**: Zeilen per Drag & Drop in die richtige Reihenfolge bringen
- **Pfeil-Buttons**: Alternative zum Drag & Drop - Zeilen mit ▲▼ verschieben
- **Rechenzeichen-Buttons**: Wähle zwischen +, −, = per Klick
- **Preis-Berechnung**: Nur ein Preis ist vorgegeben, alle anderen müssen berechnet werden
- **Formel-Eingabe**: Gib deine Berechnungsformel ein (z.B. `450×20÷100`)
- **Intelligente Validierung**:
  - Positions-Check (falsche Zeilen werden rot markiert)
  - Rechenzeichen-Check (grün/rot)
  - Preis-Check (±0,01€ Toleranz)
  - **Formel-Check durch Ergebnis**: Es wird das berechnete Ergebnis der Formel geprüft, nicht die exakte Syntax!
- **📚 Integriertes Lexikon**: Ausführliche Erklärungen zu jedem Kalkulationsschritt
  - Definitionen und Erklärungen zu allen 18 Schritten
  - Formeln (Vorwärts- und Rückwärtskalkulation)
  - Praktische Beispiele
  - Unterschiede zwischen Vor- und Rückwärtskalkulation
- **Vorgeordnete Tabelle**: Option zum Üben mit bereits sortierter Tabelle
- **Dynamische Werte**: Jede Aufgabe mit neuen Zufallswerten
- **Kompaktes Design**: Übersichtliche Darstellung aller 18 Kalkulationsschritte

## 🎯 Kalkulationsschema

Das Programm deckt alle 18 Schritte der Handelskalkulation ab:

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

## 🚀 Verwendung

### 1. Startwert wählen
Wähle aus vier Optionen:
- **LEP** (Vorwärtskalkulation vom Einkauf)
- **LVP** (Rückwärtskalkulation vom Verkauf)
- **BVP2** (Rückwärtskalkulation vom Endpreis)
- **Benutzerdefiniert**: 
  - Gib einen beliebigen Wert in Euro ein
  - Wähle die Startposition (z.B. BP, SKP, etc.)
  - Perfekt für spezielle Übungsszenarien!

### 2. Übungsoptionen
- **"Tabelle bereits angeordnet"**: 
  - ☑ Aktiviert: Übe nur Rechenzeichen und Berechnungen
  - ☐ Deaktiviert: Zusätzlich Drag & Drop-Übung

### 3. Aufgabe bearbeiten
1. **Tabelle anordnen** (wenn nicht vorgeordnet): Ziehe Zeilen oder nutze ▲▼
2. **Rechenzeichen wählen**: Klicke auf +, − oder =
3. **Preise berechnen**: Trage die berechneten Preise ein (nur ein Preis ist vorgegeben)
4. **Formeln eingeben**: Dokumentiere deine Berechnungsschritte
   - Beispiel: `450×20÷100` oder `450*20/100`
   - Das Programm prüft das **Ergebnis**, nicht die exakte Schreibweise!
   - Du kannst × oder \*, ÷ oder / verwenden
   - Komma oder Punkt für Dezimalzahlen funktionieren beide

### 4. Lösung prüfen
Klicke auf **"Lösung prüfen"** für sofortiges Feedback:
- ✅ Grün = Richtig
- ❌ Rot = Falsch
- Falsch angeordnete Zeilen: roter Hintergrund

### 5. 📚 Lexikon nutzen
Klicke auf **"📚 Lexikon"** für:
- Detaillierte Erklärungen zu jedem Kalkulationsschritt
- Formeln für Vor- und Rückwärtskalkulation
- Praktische Beispiele mit Zahlen
- Wann welche Kalkulationsart angewendet wird

## 💡 Tipps & Tricks

- **Prozentsätze**: Skonto ist immer 1-4%, andere variieren je nach Bereich
- **Bezugskosten (BK)**: Einzige Position ohne Prozentsatz (Festbetrag)
- **Zwischensummen (=)**: LEP, ZEP, BEK, BP, SKP, BVP, ZVP, LVP, BVP2
- **Toleranz**: Preise müssen auf ±0,01€ genau sein
- **Formeln**: 
  - Rechne wie du willst - **Hauptsache das Ergebnis stimmt**!
  - `500*0.2` = `500×20÷100` = `500×0,2` (alles korrekt, wenn Ergebnis = 100)
- **Lexikon**: Bei Unsicherheiten einfach öffnen für Erklärungen und Beispiele
- **Benutzerdefinierter Start**: Nutze diese Option für:
  - Gezielte Übung einzelner Kalkulationsabschnitte
  - Nachrechnen realer Beispiele aus Lehrbüchern
  - Fokus auf schwierige Bereiche

## 🛠 Installation & Start

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Produktion
npm run build
```

## 🛠️ Technologie

- **Vite 7.1.12** - Schneller Build-Tool
- **TypeScript** - Type Safety
- **Vanilla JavaScript** - Keine Frameworks, pure Performance
- **CSS3** - Moderne Styling mit Gradients, Animationen und 3D-Effekte

## 📖 Hintergrund: Handelskalkulation

### Vorwärtskalkulation
Startet mit dem **Einkaufspreis** (LEP) und berechnet den **Verkaufspreis**.  
**Frage**: "Was muss ich verlangen, um Kosten und Gewinn zu decken?"

### Rückwärtskalkulation
Startet mit dem **Verkaufspreis** (LVP/BVP2) und berechnet den maximalen **Einkaufspreis**.  
**Frage**: "Was darf das Produkt maximal kosten bei gegebenem Verkaufspreis?"

### Differenzkalkulation
Vergleich zwischen Einkaufs- und Verkaufspreis zur Gewinnermittlung.

Alle drei Kalkulationsarten werden in diesem Trainer geübt!

## 🔮 Zukünftige Erweiterungen

- Statistiken und Lernfortschritt
- Zeitbegrenzung für Geschwindigkeitstraining
- Zusätzliche Übungsszenarien (z.B. Kalkulationszuschlag berechnen)

## 📝 Lizenz

MIT

---

Viel Erfolg beim Lernen! 🎓
