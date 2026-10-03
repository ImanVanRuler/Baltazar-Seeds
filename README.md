# KI Agenten

Zwei KI-Agenten (Groq) mit einer Space-Station-Oberfläche.

- **Agent 1** antwortet dem Besucher und gibt seine Antwort automatisch an Agent 2 weiter.
- **Agent 2** reagiert darauf und kann auch direkt angeschrieben werden.

## Starten

1. Node.js installieren (Version 18 oder neuer).
2. Abhängigkeiten installieren:
   ```
   npm install
   ```
3. Datei `.env.example` nach `.env` kopieren und den Groq API Key eintragen.
4. Beide Server starten:
   ```
   npm start
   ```
5. Im Browser öffnen: http://localhost:3000

## Dateien

| Datei | Aufgabe |
|---|---|
| `server.js` | Webserver (Port 3000), Agent 1, Weiterleitung an Agent 2 |
| `agent2.js` | Agent 2 (Port 3002) |
| `ki.html` | Oberfläche |

**Wichtig:** Die Datei `.env` mit dem API Key niemals auf GitHub hochladen. Sie ist in `.gitignore` bereits ausgeschlossen.
