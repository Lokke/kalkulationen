# Testplan Kalkulationstrainer

## ✅ Tests durchgeführt

### 1. Dynamische Werte
- [x] Alle Preise werden bei jeder neuen Aufgabe zufällig generiert
- [x] Prozentsätze werden dynamisch in den vorgegebenen Bereichen erzeugt
- [x] Keine fest codierten Kalkulationswerte im Code

### 2. Startwert-Optionen
- [x] LEP (Vorwärtskalkulation): Startet mit Listeneinkaufspreis
- [x] LVP (Rückwärtskalkulation): Startet mit Listenverkaufspreis  
- [x] BVP2 (Rückwärtskalkulation): Startet mit Bruttoverkaufspreis
- [x] CUSTOM: Beliebiger Wert + Position wählbar

### 3. Vorwärtskalkulation
- [x] Berechnung von LEP → BVP2
- [x] Korrekte Addition/Subtraktion von Beträgen
- [x] Prozentuale Berechnungen auf Basis aktueller Werte
- [x] Rundung auf 2 Dezimalstellen

### 4. Rückwärtskalkulation
- [x] Berechnung von LVP/BVP2 → LEP
- [x] Verwendung vermehrter/verminderter Grundwerte
- [x] Skonto: Division durch (1 - Prozent/100) für Subtraktion
- [x] Rabatte: Division durch (1 + Prozent/100) für Addition
- [x] Korrekte Umkehrung der Operationen

### 5. Formel-Evaluierung
- [x] Akzeptiert Standard-Operatoren: + - * /
- [x] Akzeptiert mathematische Symbole: × ÷ −
- [x] Akzeptiert Komma und Punkt für Dezimalzahlen
- [x] Ergebnis-basierte Validierung (±0,01€ Toleranz)
- [x] Verschiedene Schreibweisen werden als korrekt akzeptiert
  - Beispiele: `450*20/100`, `450×20÷100`, `450*0,2`

### 6. Lexikon
- [x] Alle 18 Kalkulationsschritte mit Erklärungen
- [x] Vorwärts-/Rückwärts-/Differenzkalkulation erklärt
- [x] Formeln mit Beispielen
- [x] Basiert auf Wikipedia + lernnetz24.de Inhalten

### 7. UI-Features
- [x] Vorgeordnete Tabelle Option
- [x] Drag & Drop (wenn nicht vorgeordnet)
- [x] Arrow-Buttons zum Verschieben
- [x] Validierung mit Farbcodierung (grün/rot)
- [x] Lexikon-Panel (Slide-in von rechts)

## 🔧 Berechnungslogik

### Vorwärts (LEP Start):
```
LEP 1000€
- LR 20% → 200€ (= 1000 × 20 ÷ 100)
= ZEP 800€
- LSK 3% → 24€ (= 800 × 3 ÷ 100)
= BEK 776€
+ BK 15€
= BP 791€ (100% Basis!)
+ HKz 30% → 237,30€ (= 791 × 30 ÷ 100)
= SKP 1028,30€
...
```

### Rückwärts (LVP Start):
```
LVP 2000€
- KR 10% → Bei Rückwärts: 2000 ÷ (100-10) × 100 = 2222,22€ ZVP vor Rabatt
  Dann: 2222,22 - 2000 = 222,22€ Rabatt
= ZVP 2000€ (nach Rabatt)
- Ksk 2% → 2000 ÷ (100-2) × 100 = 2040,82€ vor Skonto
  Dann: 2040,82 - 2000 = 40,82€ Skonto
= BVP 2000€
...
```

## ✅ Alle Tests bestanden!

Die Anwendung:
- ✅ Generiert komplett dynamische Aufgaben
- ✅ Unterstützt alle drei Kalkulationsarten
- ✅ Validiert Formeln flexibel nach Ergebnis
- ✅ Hat ein vollständiges Lexikon
- ✅ Bietet flexible Startwert-Optionen
