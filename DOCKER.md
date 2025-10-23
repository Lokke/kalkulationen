# Kalkulationstrainer Docker

## Docker Image bauen und starten

### Lokales Bauen und Ausführen

```bash
# Image bauen
docker build -t kalkulationen:latest .

# Container starten
docker run -d -p 6333:6333 --name kalkulationen kalkulationen:latest

# App öffnen
open http://localhost:6333
```

### Von GitHub Container Registry

```bash
# Image pullen
docker pull ghcr.io/lokke/kalkulationen:latest

# Container starten
docker run -d -p 6333:6333 --name kalkulationen ghcr.io/lokke/kalkulationen:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  kalkulationen:
    image: ghcr.io/lokke/kalkulationen:latest
    ports:
      - "6333:6333"
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## Automatisches Deployment

Jeder Push zum `master` Branch triggert automatisch:
1. Build des Docker Images
2. Push zu GitHub Container Registry (ghcr.io)
3. Image ist verfügbar unter: `ghcr.io/lokke/kalkulationen:latest`

## Zugriff

Nach dem Start ist die App verfügbar unter:
- http://localhost:6333
