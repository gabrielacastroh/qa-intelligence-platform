# QA Intelligence Platform

Asistente de QA web impulsado por IA que audita cualquier URL pública en segundos: captura screenshots, detecta violaciones de accesibilidad, mide el rendimiento de carga, recopila errores de consola y genera una revisión técnica estructurada usando un modelo de lenguaje.

---

## Descripción general

QA Intelligence Platform automatiza la primera revisión manual de un ciclo de QA. Le das una URL y te devuelve un reporte de auditoría listo para producción con:

- Screenshot de página completa
- Código de estado HTTP y tiempo de carga
- Violaciones de accesibilidad detectadas con [axe-core](https://github.com/dequelabs/axe-core)
- Logs de consola del navegador (errores, warnings, info)
- Revisión técnica generada por IA en el estilo de una ingeniera senior de QA

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  Navegador                                                  │
│                                                             │
│   React + Vite  ──── POST /run-test ────►  FastAPI          │
│   (puerto 5173)                           (puerto 8000)     │
│                                               │             │
│                                          Playwright         │
│                                         (Chromium)          │
│                                               │             │
│                                      inyección axe-core     │
│                                      captura screenshot     │
│                                               │             │
│                                          Groq API           │
│                                     (llama-3.1-8b-instant)  │
│                                               │             │
│   ◄──────── reporte JSON + screenshot ────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router 7 |
| Backend | Python 3.12, FastAPI, Uvicorn |
| Automatización de navegador | Playwright (Chromium, headless) |
| Accesibilidad | axe-core 4.7 (inyectado en la página objetivo) |
| IA / LLM | Groq API — `llama-3.1-8b-instant` vía SDK compatible con OpenAI |
| Contenedores | Docker, Docker Compose |

---

## Integración con IA

La plataforma usa [Groq](https://groq.com) como proveedor de inferencia con un cliente compatible con OpenAI (SDK de Python `openai`). Tras cada auditoría, se envía un prompt estructurado a `llama-3.1-8b-instant` con:

- Código de estado HTTP
- Tiempo de carga de la página
- Cantidad de errores de consola
- Lista de IDs de violaciones de accesibilidad

El modelo devuelve un reporte enterprise de 4 secciones (resumen, problemas detectados, riesgos, recomendaciones) en menos de 2 segundos gracias a la velocidad de inferencia LPU de Groq.

El servicio vive en `backend/app/ai/groq_service.py` y es llamado desde `backend/app/playwright/test_runner.py` después de cada ejecución de auditoría.

---

## Estructura del proyecto

```
.
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   └── groq_service.py        # Integración con Groq LLM
│   │   ├── playwright/
│   │   │   └── test_runner.py         # Lógica de auditoría con Playwright + axe-core
│   │   ├── routes/
│   │   │   └── test_routes.py         # Endpoint POST /run-test
│   │   └── main.py                    # App FastAPI, CORS, archivos estáticos
│   ├── screenshots/                   # Screenshots generados (en .gitignore)
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/                # Componentes UI, layout y resultados
│   │   ├── pages/                     # RunTestPage, ReportPage
│   │   ├── services/                  # Cliente API tipado
│   │   ├── types/                     # Tipos TypeScript compartidos
│   │   └── utils/                     # Helpers cn, format
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Inicio rápido (Docker)

> Requiere Docker Desktop (o Docker + Docker Compose v2).

**1. Clonar y configurar**

```bash
git clone <repo-url>
cd "AI QA Assistant"

cp backend/.env.example backend/.env
# Editar backend/.env y agregar tu GROQ_API_KEY
```

Obtén una API key gratuita en [console.groq.com](https://console.groq.com).

**2. Construir y ejecutar**

```bash
docker compose up --build
```

**3. Abrir la aplicación**

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Documentación Swagger | http://localhost:8000/docs |

---

## Desarrollo local (sin Docker)

### Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Instalar Chromium de Playwright
playwright install chromium

# Configurar variables de entorno
cp .env.example .env
# Agregar tu GROQ_API_KEY en .env

# Iniciar el servidor
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**.

---

## Referencia de la API

### `POST /run-test`

Ejecuta una auditoría QA completa sobre la URL proporcionada.

**Cuerpo de la solicitud**
```json
{ "url": "https://example.com" }
```

**Respuesta**
```json
{
  "success": true,
  "status_code": 200,
  "title": "Example Domain",
  "url": "https://example.com",
  "load_time": 1.42,
  "screenshot": "screenshots/abc123.png",
  "console_logs": [],
  "accessibility_violations": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "description": "...",
      "help": "...",
      "nodes_affected": 3
    }
  ],
  "technical_review": "Resumen:\n..."
}
```

### `GET /screenshots/{filename}`

Sirve un screenshot previamente capturado como archivo estático.

---

## Variables de entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `GROQ_API_KEY` | API key de inferencia de Groq | Sí |

---

## Requisitos

- Python 3.12+
- Node.js 20+
- Docker Desktop (para configuración en contenedores)
- Una API key de Groq (tier gratuito disponible)
