import './style.css';
import { kalkulationsSchemaTemplate } from './types';

interface LernKarte {
  abkuerzung: string;
  name: string;
  reihenfolge: number;
}

class LernModus {
  private aufgabe: LernKarte[] = [];
  private userZuordnung: Map<number, string> = new Map();
  private anzahlBegriffe: 3 | 5 | 7 = 5;
  private feedback: string = '';

  constructor() {
    this.render();
    this.neueAufgabe();
  }

  private neueAufgabe() {
    this.userZuordnung.clear();
    this.feedback = '';
    
    // Wähle zufällige aufeinanderfolgende Begriffe
    const maxStart = kalkulationsSchemaTemplate.length - this.anzahlBegriffe;
    const startIndex = Math.floor(Math.random() * maxStart);
    
    this.aufgabe = kalkulationsSchemaTemplate
      .slice(startIndex, startIndex + this.anzahlBegriffe)
      .map((schema, index) => ({
        abkuerzung: schema.abkuerzung,
        name: schema.name,
        reihenfolge: index + 1
      }));
    
    this.renderAufgabe();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private pruefen() {
    let korrekt = true;
    
    for (let i = 1; i <= this.aufgabe.length; i++) {
      const gewaehlteAbk = this.userZuordnung.get(i);
      const korrekteAbk = this.aufgabe.find(k => k.reihenfolge === i)?.abkuerzung;
      
      if (gewaehlteAbk !== korrekteAbk) {
        korrekt = false;
        break;
      }
    }
    
    if (korrekt && this.userZuordnung.size === this.aufgabe.length) {
      this.feedback = '✅ Richtig! Alle Begriffe sind korrekt zugeordnet.';
    } else {
      this.feedback = '❌ Leider falsch. Versuche es noch einmal!';
    }
    
    this.renderAufgabe();
  }

  private zeigeLosung() {
    this.userZuordnung.clear();
    this.aufgabe.forEach(karte => {
      this.userZuordnung.set(karte.reihenfolge, karte.abkuerzung);
    });
    this.feedback = '💡 Lösung angezeigt';
    this.renderAufgabe();
  }

  private render() {
    const app = document.getElementById('app')!;
    app.innerHTML = `
      <div class="container">
        <div class="header">
          <h1>🎓 Lernmodus - Reihenfolge zuordnen</h1>
          <a href="/" class="back-link">← Zurück zur Übung</a>
        </div>

        <div class="lern-controls">
          <label>
            <span>Anzahl Begriffe:</span>
            <select id="anzahlSelect">
              <option value="3">3 Begriffe</option>
              <option value="5" selected>5 Begriffe</option>
              <option value="7">7 Begriffe</option>
            </select>
          </label>
          <button id="neueAufgabe">Neue Aufgabe</button>
        </div>

        <div class="lern-anleitung">
          <p>📝 Ordne die Begriffe in der richtigen Reihenfolge zu. Wähle für jede Position die passende Abkürzung aus.</p>
        </div>

        <div id="aufgabeContainer"></div>

        <div class="lern-actions">
          <button id="pruefen" class="btn-primary">Prüfen</button>
          <button id="losung" class="btn-secondary">Lösung anzeigen</button>
        </div>

        <div id="feedback" class="feedback"></div>
      </div>
    `;

    this.setupEventListeners();
  }

  private renderAufgabe() {
    const container = document.getElementById('aufgabeContainer')!;
    const feedbackEl = document.getElementById('feedback')!;
    
    // Gemischte Abkürzungen als Auswahl
    const gemischteAbk = this.shuffleArray(this.aufgabe.map(k => k.abkuerzung));
    
    container.innerHTML = `
      <div class="lern-aufgabe">
        <div class="begriffe-liste">
          <h3>Verfügbare Abkürzungen:</h3>
          <div class="abk-chips">
            ${gemischteAbk.map(abk => {
              const karte = this.aufgabe.find(k => k.abkuerzung === abk)!;
              const istZugeordnet = Array.from(this.userZuordnung.values()).includes(abk);
              return `
                <div class="abk-chip ${istZugeordnet ? 'zugeordnet' : ''}">
                  <strong>${abk}</strong>
                  <span>${karte.name}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="zuordnung-liste">
          <h3>Reihenfolge:</h3>
          ${this.aufgabe.map((_, index) => {
            const position = index + 1;
            const gewaehlteAbk = this.userZuordnung.get(position) || '';
            
            return `
              <div class="zuordnung-zeile">
                <div class="position-nummer">${position}.</div>
                <select class="zuordnung-select" data-position="${position}">
                  <option value="">-- Wähle --</option>
                  ${gemischteAbk.map(abk => `
                    <option value="${abk}" ${gewaehlteAbk === abk ? 'selected' : ''}>
                      ${abk} - ${this.aufgabe.find(k => k.abkuerzung === abk)?.name}
                    </option>
                  `).join('')}
                </select>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    feedbackEl.innerHTML = this.feedback;
    feedbackEl.className = `feedback ${this.feedback.includes('✅') ? 'success' : ''} ${this.feedback.includes('❌') ? 'error' : ''}`;

    // Event Listeners für Dropdowns
    document.querySelectorAll('.zuordnung-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const position = parseInt((e.target as HTMLSelectElement).dataset.position || '0');
        const value = (e.target as HTMLSelectElement).value;
        
        if (value) {
          this.userZuordnung.set(position, value);
        } else {
          this.userZuordnung.delete(position);
        }
        
        this.renderAufgabe();
      });
    });
  }

  private setupEventListeners() {
    const neueAufgabeBtn = document.getElementById('neueAufgabe')!;
    const pruefenBtn = document.getElementById('pruefen')!;
    const loesungBtn = document.getElementById('losung')!;
    const anzahlSelect = document.getElementById('anzahlSelect') as HTMLSelectElement;

    neueAufgabeBtn.addEventListener('click', () => this.neueAufgabe());
    pruefenBtn.addEventListener('click', () => this.pruefen());
    loesungBtn.addEventListener('click', () => this.zeigeLosung());
    
    anzahlSelect.addEventListener('change', (e) => {
      this.anzahlBegriffe = parseInt((e.target as HTMLSelectElement).value) as 3 | 5 | 7;
      this.neueAufgabe();
    });
  }
}

new LernModus();
