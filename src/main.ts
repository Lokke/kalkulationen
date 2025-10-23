import './style.css';
import type { KalkulationsZeile, KalkulationsEinstellungen, TextAufgabe } from './types';
import { kalkulationsSchemaTemplate } from './types';
import { kalkulationsLexikon, allgemeineInfos } from './lexikon';
import { generiereTextaufgabe } from './textaufgaben';

type UebungsModus = 'anordnung' | 'operation' | 'vollstaendig';

class KalkulationsTrainer {
  private daten: KalkulationsZeile[] = [];
  private korrekteDaten: KalkulationsZeile[] = [];
  private modus: UebungsModus = 'anordnung';
  private einstellungen: KalkulationsEinstellungen = {
    startWertTyp: 'LEP',
    tabelleVorgeordnet: false,
    pruefungsModus: false
  };
  private draggedElement: HTMLTableRowElement | null = null;
  private lexikonVisible: boolean = false;
  private aktuelleTextaufgabe: TextAufgabe | null = null;
  private geloest: boolean = false; // Track ob bereits geprüft wurde
  private zeilenValidierung: Map<number, boolean> = new Map(); // Zeilen-Validierung speichern
  
  constructor() {
    this.render();
    this.neueAufgabe();
  }

  // Formel auswerten - akzeptiert +, -, *, /, ×, ÷
  private evaluateFormel(formel: string, _previousPreis: number): number | null {
    try {
      // Normalisiere Eingabe - erlaube alle gängigen Schreibweisen
      let normalized = formel.replace(/\s/g, '');
      // Ersetze mathematische Symbole
      normalized = normalized.replace(/×/g, '*');
      normalized = normalized.replace(/÷/g, '/');
      normalized = normalized.replace(/−/g, '-'); // Minus-Zeichen
      // Komma zu Punkt für Dezimalzahlen
      normalized = normalized.replace(/,/g, '.');
      
      // Einfache Math evaluation (sicher für bekannte Operationen)
      const result = Function('"use strict"; return (' + normalized + ')')();
      return typeof result === 'number' && isFinite(result) ? result : null;
    } catch {
      return null;
    }
  }

  private generateRandomData(): KalkulationsZeile[] {
    const daten: KalkulationsZeile[] = [];
    let currentPreis = 0;

    // Startwert festlegen
    if (this.einstellungen.startWertTyp === 'CUSTOM' && this.einstellungen.startWertCustom) {
      currentPreis = this.einstellungen.startWertCustom;
    } else if (this.einstellungen.startWertTyp === 'LEP') {
      currentPreis = Math.round((Math.random() * 500 + 200) * 100) / 100;
    } else if (this.einstellungen.startWertTyp === 'LVP') {
      currentPreis = Math.round((Math.random() * 800 + 400) * 100) / 100;
    } else { // BVP2
      currentPreis = Math.round((Math.random() * 1000 + 500) * 100) / 100;
    }

    // Bei Rückwärtskalkulation von hinten berechnen
    if (this.einstellungen.startWertTyp === 'BVP2' || this.einstellungen.startWertTyp === 'LVP') {
      return this.generateRueckwaerts(currentPreis);
    }

    const startIndex = this.einstellungen.startWertTyp === 'CUSTOM' && this.einstellungen.startPositionIndex !== undefined
      ? this.einstellungen.startPositionIndex
      : 0;

    // Vorwärtskalkulation
    kalkulationsSchemaTemplate.forEach((schema, index) => {
      const zeile: KalkulationsZeile = {
        id: index,
        operation: schema.operation,
        abkuerzung: schema.abkuerzung,
        name: schema.name,
        prozent: null,
        preis: null,
        userPreis: '',
        userFormel: '',
        formel: '',
        isFixed: false,
        originalOrder: index
      };

      if (index === startIndex) {
        zeile.preis = currentPreis;
        zeile.userPreis = zeile.preis.toFixed(2);
        zeile.isFixed = true;
      } else if (schema.operation === '-' || schema.operation === '+') {
        if (schema.isSkonto) {
          zeile.prozent = Math.floor(Math.random() * 4) + 1;
        } else if (schema.prozentRange) {
          zeile.prozent = Math.floor(Math.random() * (schema.prozentRange[1] - schema.prozentRange[0]) + schema.prozentRange[0]);
        }

        if (zeile.prozent) {
          const betrag = Math.round((currentPreis * zeile.prozent / 100) * 100) / 100;
          zeile.preis = betrag;
          zeile.formel = `${currentPreis.toFixed(2)}×${zeile.prozent}÷100`;
          
          if (schema.operation === '-') {
            currentPreis -= betrag;
          } else {
            currentPreis += betrag;
          }
        } else {
          const betrag = Math.round((Math.random() * 20 + 5) * 100) / 100;
          zeile.preis = betrag;
          currentPreis += betrag;
        }
      } else if (schema.operation === '=') {
        zeile.preis = Math.round(currentPreis * 100) / 100;
      }

      daten.push(zeile);
    });

    return daten;
  }

  private generateRueckwaerts(startPreis: number): KalkulationsZeile[] {
    const daten: KalkulationsZeile[] = [];
    const template = [...kalkulationsSchemaTemplate].reverse();
    let currentPreis = startPreis;

    template.forEach((_schema, reverseIndex) => {
      const index = kalkulationsSchemaTemplate.length - 1 - reverseIndex;
      const originalSchema = kalkulationsSchemaTemplate[index];
      
      const zeile: KalkulationsZeile = {
        id: index,
        operation: originalSchema.operation,
        abkuerzung: originalSchema.abkuerzung,
        name: originalSchema.name,
        prozent: null,
        preis: null,
        userPreis: '',
        userFormel: '',
        formel: '',
        isFixed: false,
        originalOrder: index
      };

      if ((this.einstellungen.startWertTyp === 'BVP2' && originalSchema.abkuerzung === 'BVP2') ||
          (this.einstellungen.startWertTyp === 'LVP' && originalSchema.abkuerzung === 'LVP')) {
        zeile.preis = currentPreis;
        zeile.userPreis = zeile.preis.toFixed(2);
        zeile.isFixed = true;
        daten.unshift(zeile);
        return;
      }

      if (originalSchema.operation === '-' || originalSchema.operation === '+') {
        if (originalSchema.isSkonto) {
          zeile.prozent = Math.floor(Math.random() * 4) + 1;
        } else if (originalSchema.prozentRange) {
          zeile.prozent = Math.floor(Math.random() * (originalSchema.prozentRange[1] - originalSchema.prozentRange[0]) + originalSchema.prozentRange[0]);
        }

        if (zeile.prozent) {
          if (originalSchema.operation === '+') {
            currentPreis = currentPreis / (1 + zeile.prozent / 100);
          } else {
            currentPreis = currentPreis / (1 - zeile.prozent / 100);
          }
          zeile.preis = Math.round((currentPreis * zeile.prozent / 100) * 100) / 100;
        } else {
          const betrag = Math.round((Math.random() * 20 + 5) * 100) / 100;
          zeile.preis = betrag;
          currentPreis -= betrag;
        }
      } else if (originalSchema.operation === '=') {
        zeile.preis = Math.round(currentPreis * 100) / 100;
      }

      daten.unshift(zeile);
    });

    return daten;
  }

  private toggleLexikon() {
    this.lexikonVisible = !this.lexikonVisible;
    const lexikonPanel = document.getElementById('lexikonPanel');
    if (lexikonPanel) {
      lexikonPanel.style.display = this.lexikonVisible ? 'block' : 'none';
    }
  }

  private renderLexikon(): string {
    return `
      <div id="lexikonPanel" class="lexikon-panel" style="display: none;">
        <div class="lexikon-header">
          <h2>📚 Lexikon</h2>
          <button id="closeLexikon" class="close-btn">×</button>
        </div>
        <div class="lexikon-content">
          <div class="lexikon-section">
            <h3>${allgemeineInfos.vorwaertskalkulation.titel}</h3>
            <p>${allgemeineInfos.vorwaertskalkulation.beschreibung}</p>
            <p><em>Wann: ${allgemeineInfos.vorwaertskalkulation.wann}</em></p>
          </div>
          <div class="lexikon-section">
            <h3>${allgemeineInfos.rueckwaertskalkulation.titel}</h3>
            <p>${allgemeineInfos.rueckwaertskalkulation.beschreibung}</p>
            <p><em>Wann: ${allgemeineInfos.rueckwaertskalkulation.wann}</em></p>
          </div>
          <hr/>
          ${kalkulationsLexikon.map(eintrag => `
            <div class="lexikon-eintrag">
              <h4><strong>${eintrag.abkuerzung}</strong> - ${eintrag.titel}</h4>
              <p>${eintrag.erklaerung}</p>
              ${eintrag.formelVorwaerts ? `<p class="formel"><strong>Formel:</strong> ${eintrag.formelVorwaerts}</p>` : ''}
              ${eintrag.beispiel ? `<p class="beispiel"><em>Beispiel:</em> ${eintrag.beispiel}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private setupEventListeners() {
    const modusSelect = document.getElementById('modus') as HTMLSelectElement;
    const startWertSelect = document.getElementById('startWert') as HTMLSelectElement;
    const customWertInput = document.getElementById('customWert') as HTMLInputElement;
    const customPositionSelect = document.getElementById('customPosition') as HTMLSelectElement;
    const vorgeordnetCheckbox = document.getElementById('vorgeordnet') as HTMLInputElement;
    const pruefungsModusCheckbox = document.getElementById('pruefungsModus') as HTMLInputElement;
    const neueAufgabeBtn = document.getElementById('neueAufgabe') as HTMLButtonElement;
    const pruefeBtn = document.getElementById('pruefe') as HTMLButtonElement;
    const lexikonBtn = document.getElementById('lexikonBtn') as HTMLButtonElement;
    const closeLexikon = document.getElementById('closeLexikon') as HTMLButtonElement;

    modusSelect?.addEventListener('change', (e) => {
      this.modus = (e.target as HTMLSelectElement).value as UebungsModus;
      this.neueAufgabe();
    });

    startWertSelect?.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      this.einstellungen.startWertTyp = value as any;
      
      // Show/hide custom inputs
      const customInputs = document.getElementById('customInputs');
      if (customInputs) {
        customInputs.style.display = value === 'CUSTOM' ? 'block' : 'none';
      }
      
      this.neueAufgabe();
    });

    customWertInput?.addEventListener('change', (e) => {
      this.einstellungen.startWertCustom = parseFloat((e.target as HTMLInputElement).value);
      this.neueAufgabe();
    });

    customPositionSelect?.addEventListener('change', (e) => {
      this.einstellungen.startPositionIndex = parseInt((e.target as HTMLSelectElement).value);
      this.neueAufgabe();
    });

    vorgeordnetCheckbox?.addEventListener('change', (e) => {
      this.einstellungen.tabelleVorgeordnet = (e.target as HTMLInputElement).checked;
      this.neueAufgabe();
    });
    
    pruefungsModusCheckbox?.addEventListener('change', (e) => {
      this.einstellungen.pruefungsModus = (e.target as HTMLInputElement).checked;
      
      // Im Prüfungsmodus: Andere Optionen deaktivieren
      if (this.einstellungen.pruefungsModus) {
        if (startWertSelect) startWertSelect.disabled = true;
        if (vorgeordnetCheckbox) vorgeordnetCheckbox.disabled = true;
        if (modusSelect) modusSelect.disabled = true;
        if (lexikonBtn) lexikonBtn.disabled = true;
      } else {
        if (startWertSelect) startWertSelect.disabled = false;
        if (vorgeordnetCheckbox) vorgeordnetCheckbox.disabled = false;
        if (modusSelect) modusSelect.disabled = false;
        if (lexikonBtn) lexikonBtn.disabled = false;
      }
      
      this.neueAufgabe();
    });

    neueAufgabeBtn?.addEventListener('click', () => {
      this.neueAufgabe();
    });

    pruefeBtn?.addEventListener('click', () => {
      this.pruefeLoesung();
    });

    lexikonBtn?.addEventListener('click', () => {
      this.toggleLexikon();
    });

    closeLexikon?.addEventListener('click', () => {
      this.toggleLexikon();
    });
  }

  private neueAufgabe() {
    this.clearFeedback();
    this.geloest = false;
    this.zeilenValidierung.clear();
    
    // Prüfungsmodus
    if (this.einstellungen.pruefungsModus) {
      this.aktuelleTextaufgabe = generiereTextaufgabe(Math.random() > 0.5 ? 'vorwaerts' : 'rueckwaerts');
      this.zeigePruefungsaufgabe();
      return;
    }
    
    this.korrekteDaten = this.generateRandomData();
    
    if (this.modus === 'anordnung') {
      this.daten = this.einstellungen.tabelleVorgeordnet ? [...this.korrekteDaten] : this.shuffleArray([...this.korrekteDaten]);
      this.daten.forEach(zeile => {
        zeile.operation = '';
        if (!zeile.isFixed) {
          zeile.userPreis = '';
          zeile.userFormel = '';
        }
      });
    } else if (this.modus === 'operation') {
      this.daten = [...this.korrekteDaten];
      this.daten.forEach(zeile => {
        zeile.operation = '';
        if (!zeile.isFixed) {
          zeile.userPreis = '';
          zeile.userFormel = '';
        }
      });
    } else {
      this.daten = [...this.korrekteDaten];
      this.daten.forEach(zeile => {
        zeile.operation = '';
        if (!zeile.isFixed) {
          zeile.userPreis = '';
          zeile.userFormel = '';
        }
      });
    }

    this.renderTabelle();
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private pruefeLoesung() {
    let allCorrect = true;
    let fehlerAnzahl = 0;

    document.querySelectorAll('tbody tr').forEach(row => {
      row.classList.remove('wrong-position');
    });

    if (this.modus === 'anordnung') {
      this.daten.forEach((zeile, index) => {
        const korrekt = this.korrekteDaten[index];
        const row = document.querySelector(`tr[data-index="${index}"]`);
        
        // Prüfe Reihenfolge
        if (zeile.id !== korrekt.id) {
          allCorrect = false;
          fehlerAnzahl++;
          if (row) {
            row.classList.add('wrong-position');
          }
        }

        // Prüfe Operation
        const buttons = document.querySelectorAll(`[data-row="${index}"] .operation-btn`);
        buttons.forEach(btn => {
          btn.classList.remove('correct', 'incorrect');
          if (btn.classList.contains('selected')) {
            const op = btn.getAttribute('data-operation');
            if (op === korrekt.operation) {
              btn.classList.add('correct');
            } else {
              btn.classList.add('incorrect');
              allCorrect = false;
              fehlerAnzahl++;
            }
          }
        });

        if (!zeile.operation) {
          allCorrect = false;
          fehlerAnzahl++;
        }

        // Prüfe Preise
        if (!zeile.isFixed) {
          const input = document.getElementById(`preis-${index}`) as HTMLInputElement;
          const userValue = parseFloat(zeile.userPreis.replace(',', '.'));
          const correctValue = korrekt.preis;
          
          if (input && correctValue !== null) {
            if (isNaN(userValue) || Math.abs(userValue - correctValue) > 0.01) {
              input.classList.add('incorrect');
              input.classList.remove('correct');
              allCorrect = false;
              fehlerAnzahl++;
            } else {
              input.classList.add('correct');
              input.classList.remove('incorrect');
            }
          }
        }

        // Prüfe Formeln DURCH ERGEBNIS
        if (!zeile.isFixed && zeile.userFormel && zeile.prozent) {
          const input = document.getElementById(`formel-${index}`) as HTMLInputElement;
          const previousZeile = this.korrekteDaten[index - 1];
          
          if (input && previousZeile && previousZeile.preis !== null) {
            const calculatedResult = this.evaluateFormel(zeile.userFormel, previousZeile.preis);
            const correctValue = korrekt.preis;
            
            if (calculatedResult === null || correctValue === null || Math.abs(calculatedResult - correctValue) > 0.01) {
              input.classList.add('incorrect');
              input.classList.remove('correct');
              allCorrect = false;
              fehlerAnzahl++;
            } else {
              input.classList.add('correct');
              input.classList.remove('incorrect');
            }
          }
        }
      });
    } else {
      this.daten.forEach((_zeile, index) => {
        const korrekt = this.korrekteDaten[index];
        const buttons = document.querySelectorAll(`[data-row="${index}"] .operation-btn`);
        
        buttons.forEach(btn => {
          btn.classList.remove('correct', 'incorrect');
          if (btn.classList.contains('selected')) {
            const op = btn.getAttribute('data-operation');
            if (op === korrekt.operation) {
              btn.classList.add('correct');
            } else {
              btn.classList.add('incorrect');
              allCorrect = false;
              fehlerAnzahl++;
            }
          }
        });
      });
    }

    this.showFeedback(allCorrect, fehlerAnzahl);
    
    // Nach erfolgreicher Prüfung: Fehlerkorrektur ermöglichen
    if (!allCorrect) {
      this.geloest = true; // Markiere als "geprüft" damit weitere Eingaben möglich sind
    }
  }

  // Prüfe einzelne Zeile (während Bearbeitung)
  private pruefeZeile(index: number): void {
    const zeile = this.daten[index];
    const korrekt = this.korrekteDaten.find(k => k.id === zeile.id);
    
    if (!korrekt) return;

    // Prüfe Preis
    if (!zeile.isFixed) {
      const input = document.getElementById(`preis-${index}`) as HTMLInputElement;
      const userValue = parseFloat(zeile.userPreis.replace(',', '.'));
      const correctValue = korrekt.preis;
      
      if (input && correctValue !== null) {
        if (isNaN(userValue) || Math.abs(userValue - correctValue) > 0.01) {
          input.classList.add('incorrect');
          input.classList.remove('correct');
          this.zeilenValidierung.set(index, false);
        } else {
          input.classList.add('correct');
          input.classList.remove('incorrect');
          this.zeilenValidierung.set(index, true);
        }
      }
    }

    // Prüfe Formel (durch Ergebnis)
    if (zeile.userFormel) {
      const formelInput = document.getElementById(`formel-${index}`) as HTMLInputElement;
      const userResult = this.evaluateFormel(zeile.userFormel, 0);
      const correctValue = korrekt.preis;
      
      if (formelInput && correctValue !== null && userResult !== null) {
        if (Math.abs(userResult - correctValue) <= 0.01) {
          formelInput.classList.add('correct');
          formelInput.classList.remove('incorrect');
        } else {
          formelInput.classList.add('incorrect');
          formelInput.classList.remove('correct');
        }
      }
    }
  }

  private showFeedback(success: boolean, fehlerAnzahl: number) {
    const feedback = document.getElementById('feedback') as HTMLDivElement;
    feedback.className = 'feedback';
    
    if (success) {
      feedback.classList.add('success');
      feedback.textContent = '🎉 Perfekt! Alle Angaben sind korrekt!';
    } else {
      feedback.classList.add('error');
      feedback.textContent = `❌ ${fehlerAnzahl} Fehler gefunden. Versuche es nochmal!`;
    }
  }

  private clearFeedback() {
    const feedback = document.getElementById('feedback') as HTMLDivElement;
    if (feedback) {
      feedback.className = 'feedback';
      feedback.textContent = '';
    }

    document.querySelectorAll('.operation-btn').forEach(btn => {
      btn.classList.remove('correct', 'incorrect');
    });
    
    document.querySelectorAll('.preis-input').forEach(input => {
      input.classList.remove('correct', 'incorrect');
    });
    
    document.querySelectorAll('.formel-input').forEach(input => {
      input.classList.remove('correct', 'incorrect');
    });
    
    document.querySelectorAll('tbody tr').forEach(row => {
      row.classList.remove('wrong-position');
    });
  }

  private render() {
    const app = document.getElementById('app')!;
    
    app.innerHTML = `
      <h1>📊 Kalkulationstrainer</h1>
      
      <div class="controls">
        <div class="control-row">
          <label for="modus">Übungsmodus:</label>
          <select id="modus">
            <option value="anordnung">Tabelle anordnen + Zeichen</option>
            <option value="operation">Nur Rechenzeichen</option>
            <option value="vollstaendig">Vollständig (später)</option>
          </select>
          
          <label for="startWert">Startwert:</label>
          <select id="startWert">
            <option value="LEP">Listeneinkaufspreis</option>
            <option value="LVP">Listenverkaufspreis</option>
            <option value="BVP2">Bruttoverkaufspreis</option>
            <option value="CUSTOM">Benutzerdefiniert</option>
          </select>
          
          <div id="customInputs" style="display: none; margin-left: 1rem;">
            <input type="number" id="customWert" placeholder="Wert in €" min="1" step="0.01" style="width: 100px;" />
            <select id="customPosition" style="width: 80px;">
              ${kalkulationsSchemaTemplate.map((s, i) => `<option value="${i}">${s.abkuerzung}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="control-row">
          <label>
            <input type="checkbox" id="vorgeordnet" />
            Tabelle bereits angeordnet
          </label>
          
          <label>
            <input type="checkbox" id="pruefungsModus" />
            🎓 Prüfungsmodus
          </label>
          
          <button id="neueAufgabe">Neue Aufgabe</button>
          <button id="pruefe">Lösung prüfen</button>
          <button id="lexikonBtn" class="lexikon-btn">📚 Lexikon</button>
        </div>
      </div>

      <div id="feedback" class="feedback"></div>
      
      <div id="textaufgabe" class="textaufgabe" style="display: none;"></div>

      <div class="kalkulation-container">
        <table id="kalkulationTabelle">
          <thead>
            <tr>
              ${this.modus === 'anordnung' && !this.einstellungen.tabelleVorgeordnet ? '<th class="move-col">↕</th>' : ''}
              <th>Zeichen</th>
              <th>Abkürzung</th>
              <th>Bezeichnung</th>
              <th>Prozent</th>
              <th>Formel</th>
              <th>Preis</th>
            </tr>
          </thead>
          <tbody id="tabellenBody">
          </tbody>
        </table>
      </div>

      ${this.renderLexikon()}
    `;

    this.setupEventListeners();
  }

  private renderTabelle() {
    const tbody = document.getElementById('tabellenBody')!;
    const showMoveCol = this.modus === 'anordnung' && !this.einstellungen.tabelleVorgeordnet;
    
    tbody.innerHTML = this.daten.map((zeile, index) => {
      const prozentText = zeile.prozent ? `${zeile.prozent}%` : '';
      const isFirst = index === 0;
      const isLast = index === this.daten.length - 1;
      
      let preisHtml = '';
      if (zeile.isFixed) {
        preisHtml = `<div class="preis-fixed">${zeile.preis?.toFixed(2)} €</div>`;
      } else {
        preisHtml = `<input 
          type="text" 
          class="preis-input" 
          id="preis-${index}"
          value="${zeile.userPreis}" 
          placeholder="0,00"
          data-index="${index}"
        />`;
      }
      
      let formelHtml = '';
      if (zeile.isFixed || zeile.prozent === null) {
        formelHtml = '<span class="formel-display">-</span>';
      } else {
        formelHtml = `<input 
          type="text" 
          class="formel-input" 
          id="formel-${index}"
          value="${zeile.userFormel}" 
          placeholder="z.B. 450×20÷100"
          data-index="${index}"
        />`;
      }
      
      return `
        <tr draggable="${showMoveCol}" data-index="${index}" data-id="${zeile.id}" class="${showMoveCol ? 'drag-handle' : ''}">
          ${showMoveCol ? `
            <td class="move-col">
              <div class="move-buttons">
                <button class="move-btn" data-index="${index}" data-direction="up" ${isFirst ? 'disabled' : ''} title="Nach oben">▲</button>
                <button class="move-btn" data-index="${index}" data-direction="down" ${isLast ? 'disabled' : ''} title="Nach unten">▼</button>
              </div>
            </td>
          ` : ''}
          <td class="operation" data-row="${index}">
            ${this.renderOperationSelector(zeile, index)}
          </td>
          <td class="abkuerzung">${zeile.abkuerzung}</td>
          <td class="name-col">${zeile.name}</td>
          <td class="prozent-col">${prozentText}</td>
          <td class="formel-col">${formelHtml}</td>
          <td class="preis-col">${preisHtml}</td>
        </tr>
      `;
    }).join('');

    if (showMoveCol) {
      this.setupDragAndDrop();
      this.setupMoveButtons();
    }
    this.setupOperationButtons();
    this.setupPreisInputs();
    this.setupFormelInputs();
  }

  private renderOperationSelector(zeile: KalkulationsZeile, index: number): string {
    const operations = [
      { symbol: '+', value: '+' },
      { symbol: '−', value: '-' },
      { symbol: '=', value: '=' }
    ];

    return `
      <div class="operation-selector">
        ${operations.map(op => `
          <button 
            class="operation-btn ${zeile.operation === op.value ? 'selected' : ''}" 
            data-operation="${op.value}"
            data-row="${index}"
          >
            ${op.symbol}
          </button>
        `).join('')}
      </div>
    `;
  }

  private setupOperationButtons() {
    document.querySelectorAll('.operation-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.target as HTMLButtonElement;
        const row = button.getAttribute('data-row');
        const operation = button.getAttribute('data-operation');
        
        if (row && operation) {
          const rowIndex = parseInt(row);
          
          document.querySelectorAll(`[data-row="${row}"]`).forEach(b => {
            b.classList.remove('selected');
          });
          
          button.classList.add('selected');
          this.daten[rowIndex].operation = operation as any;
        }
      });
    });
  }

  private setupPreisInputs() {
    document.querySelectorAll('.preis-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const index = parseInt(target.getAttribute('data-index') || '0');
        this.daten[index].userPreis = target.value;
        target.classList.remove('correct', 'incorrect');
      });
      
      // Zeilen-Prüfung per Blur (wenn Feld verlassen wird)
      input.addEventListener('blur', (e) => {
        if (!this.geloest) { // Nur wenn noch nicht komplett geprüft
          const target = e.target as HTMLInputElement;
          const index = parseInt(target.getAttribute('data-index') || '0');
          this.pruefeZeile(index);
        }
      });
    });
  }

  private setupFormelInputs() {
    document.querySelectorAll('.formel-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const index = parseInt(target.getAttribute('data-index') || '0');
        const formel = target.value;
        this.daten[index].userFormel = formel;
        target.classList.remove('correct', 'incorrect');
        
        // Formel auswerten und Preis-Feld automatisch füllen
        if (formel.trim()) {
          const ergebnis = this.evaluateFormel(formel, 0);
          if (ergebnis !== null && !isNaN(ergebnis)) {
            this.daten[index].userPreis = ergebnis.toFixed(2);
            const preisInput = document.getElementById(`preis-${index}`) as HTMLInputElement;
            if (preisInput) {
              preisInput.value = ergebnis.toFixed(2);
            }
          }
        }
      });
      
      // Zeilen-Prüfung per Blur (wenn Feld verlassen wird)
      input.addEventListener('blur', (e) => {
        if (!this.geloest) { // Nur wenn noch nicht komplett geprüft
          const target = e.target as HTMLInputElement;
          const index = parseInt(target.getAttribute('data-index') || '0');
          this.pruefeZeile(index);
        }
      });
    });
  }

  private setupDragAndDrop() {
    const rows = document.querySelectorAll<HTMLTableRowElement>('tbody tr');

    rows.forEach(row => {
      row.addEventListener('dragstart', (e) => {
        this.draggedElement = row;
        row.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
        }
      });

      row.addEventListener('dragend', () => {
        row.classList.remove('dragging');
        document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('drag-over'));
        this.draggedElement = null;
      });

      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move';
        }
        
        if (this.draggedElement && this.draggedElement !== row) {
          document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('drag-over'));
          row.classList.add('drag-over');
        }
      });

      row.addEventListener('dragleave', () => {
        row.classList.remove('drag-over');
      });

      row.addEventListener('drop', (e) => {
        e.preventDefault();
        document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('drag-over'));
        
        if (this.draggedElement && this.draggedElement !== row) {
          const draggedIndex = parseInt(this.draggedElement.getAttribute('data-index') || '0');
          const targetIndex = parseInt(row.getAttribute('data-index') || '0');
          
          const [movedItem] = this.daten.splice(draggedIndex, 1);
          this.daten.splice(targetIndex, 0, movedItem);
          
          this.renderTabelleWithAnimation();
        }
      });
    });
  }

  private renderTabelleWithAnimation() {
    const tbody = document.getElementById('tabellenBody')!;
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => row.classList.add('moving'));
    
    setTimeout(() => {
      this.renderTabelle();
    }, 50);
  }

  private setupMoveButtons() {
    document.querySelectorAll('.move-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.target as HTMLButtonElement;
        const index = parseInt(button.getAttribute('data-index') || '0');
        const direction = button.getAttribute('data-direction');

        if (direction === 'up' && index > 0) {
          const temp = this.daten[index];
          this.daten[index] = this.daten[index - 1];
          this.daten[index - 1] = temp;
          this.renderTabelle();
        } else if (direction === 'down' && index < this.daten.length - 1) {
          const temp = this.daten[index];
          this.daten[index] = this.daten[index + 1];
          this.daten[index + 1] = temp;
          this.renderTabelle();
        }
      });
    });
  }
  
  // Prüfungsmodus: Textaufgabe anzeigen
  private zeigePruefungsaufgabe() {
    if (!this.aktuelleTextaufgabe) return;
    
    const textaufgabeDiv = document.getElementById('textaufgabe');
    if (textaufgabeDiv) {
      textaufgabeDiv.style.display = 'block';
      textaufgabeDiv.innerHTML = `
        <h3>📝 Prüfungsaufgabe</h3>
        <div class="aufgaben-text">${this.aktuelleTextaufgabe.text.replace(/\n/g, '<br/>')}</div>
      `;
    }
    
    // Erstelle Kalkulation basierend auf Textaufgabe
    this.erstellePruefungsKalkulation();
    this.renderTabelle();
  }
  
  private erstellePruefungsKalkulation() {
    if (!this.aktuelleTextaufgabe) return;
    
    const { startwert, startPosition, werte } = this.aktuelleTextaufgabe;
    
    // Korrekte Lösung berechnen
    this.korrekteDaten = [];
    let currentPreis = startwert;
    
    kalkulationsSchemaTemplate.forEach((schema, index) => {
      const zeile: KalkulationsZeile = {
        id: index,
        operation: schema.operation,
        abkuerzung: schema.abkuerzung,
        name: schema.name,
        prozent: null,
        preis: null,
        userPreis: '',
        userFormel: '',
        formel: '',
        isFixed: false,
        originalOrder: index
      };
      
      // Startwert setzen
      if (index === startPosition) {
        zeile.preis = startwert;
        zeile.userPreis = startwert.toFixed(2);
        zeile.isFixed = true;
        currentPreis = startwert;
      } else {
        // Wert aus Textaufgabe holen
        const wert = werte.get(schema.abkuerzung);
        
        if (wert !== undefined) {
          if (schema.abkuerzung === 'BK') {
            // Bezugskosten als Festbetrag
            zeile.preis = wert;
            currentPreis += wert;
          } else if (schema.operation === '+' || schema.operation === '-') {
            zeile.prozent = wert;
            const betrag = Math.round((currentPreis * wert / 100) * 100) / 100;
            zeile.preis = betrag;
            zeile.formel = `${currentPreis.toFixed(2)}×${wert}÷100`;
            
            if (schema.operation === '-') {
              currentPreis -= betrag;
            } else {
              currentPreis += betrag;
            }
          }
        } else if (schema.operation === '=') {
          zeile.preis = Math.round(currentPreis * 100) / 100;
        }
      }
      
      this.korrekteDaten.push(zeile);
    });
    
    // Unsortierte Tabelle für Prüfungsmodus
    this.daten = this.shuffleArray([...this.korrekteDaten]);
    this.daten.forEach(zeile => {
      zeile.operation = '';
      if (!zeile.isFixed) {
        zeile.userPreis = '';
        zeile.userFormel = '';
      }
    });
  }
}

new KalkulationsTrainer();
