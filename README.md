# ✈️ Voyager AI — AI Travel Super App

> Next-generation AI-powered travel planning ecosystem combining trip planning, flight & hotel booking, maps, expense tracking, social feed, AI chatbot, translation, marketplace and more — in one unified full-stack app.

---

## 🏗 Project Structure

```
voyager-ai/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # App entry point + all routers
│   ├── database.py           # SQLAlchemy async SQLite setup
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── user.py           # User model
│   │   ├── trip.py           # Trip + Booking models
│   │   ├── flight.py         # Flight, Hotel, Transport models
│   │   └── expense.py        # Expense, Social, Group, Marketplace, Notification
│   ├── routers/              # FastAPI routers (1 per module)
│   │   ├── auth.py           # JWT register/login/me
│   │   ├── trips.py          # AI trip generation + CRUD
│   │   ├── flights.py        # Flight search + tracking
│   │   ├── hotels.py         # Hotel search + recommendations
│   │   ├── transport.py      # Train, bus, taxi, rental search
│   │   ├── expense.py        # Expense tracker + currency conversion
│   │   ├── chatbot.py        # AI travel chatbot (Gemini/Groq)
│   │   ├── translate.py      # 100+ language AI translation
│   │   ├── social.py         # Travel feed, posts, likes
│   │   ├── group.py          # Group travel, polls, shared itinerary
│   │   ├── marketplace.py    # Tour guides, experiences, packages
│   │   ├── maps.py           # Geocoding, directions, POIs
│   │   ├── emergency.py      # SOS, emergency contacts, hospitals
│   │   ├── content.py        # AI blog, caption, packing list generator
│   │   ├── gamification.py   # XP, badges, leaderboard
│   │   └── notifications.py  # User notifications
│   ├── services/
│   │   └── ai_service.py     # Gemini + Groq + mock fallback
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 # React + TypeScript + Vite frontend
    ├── src/
    │   ├── main.tsx           # React entry
    │   ├── App.tsx            # Router with all routes
    │   ├── store.ts           # Zustand auth + app state
    │   ├── api/
    │   │   └── client.ts      # Axios + all API functions
    │   ├── components/
    │   │   ├── AppLayout.tsx  # Sidebar + topbar + bottom nav
    │   │   └── SplashScreen.tsx
    │   └── pages/
    │       ├── LoginPage.tsx
    │       ├── RegisterPage.tsx
    │       ├── HomePage.tsx         # Dashboard with stats & destinations
    │       ├── PlannerPage.tsx      # 3-step AI trip generator
    │       ├── ItineraryPage.tsx    # Day-by-day trip viewer
    │       ├── FlightsPage.tsx      # Search + track flights
    │       ├── HotelsPage.tsx       # Hotel search with filters
    │       ├── TransportPage.tsx    # Train, bus, taxi, rental
    │       ├── ExpensePage.tsx      # Expense tracker + summary
    │       ├── MapsPage.tsx         # Directions, geocode, POIs
    │       ├── ChatbotPage.tsx      # AI travel chatbot
    │       ├── SocialPage.tsx       # Travel feed
    │       ├── MarketplacePage.tsx  # Tours, guides, experiences
    │       ├── EmergencyPage.tsx    # SOS + emergency contacts
    │       ├── TranslatePage.tsx    # 100+ language translator
    │       ├── ContentPage.tsx      # AI blog/caption/packing generator
    │       ├── ProfilePage.tsx      # Profile, badges, leaderboard
    │       └── SettingsPage.tsx     # App settings
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys (optional – works with mock data without keys)

# Start server
python main.py
# → API running at http://localhost:8000
# → Swagger docs at http://localhost:8000/api/docs
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → App running at http://localhost:3000
```

### 3. Open the App

- **App**: http://localhost:3000
- **API Docs**: http://localhost:8000/api/docs
- Click **"Try Demo Account"** to auto-create and login instantly

---

## 🤖 AI Configuration (Optional)

The app works **fully without any API keys** using intelligent mock data. To enable live AI:

### Gemini (Recommended — Free Tier)
```env
GEMINI_API_KEY=your_key_from_aistudio.google.com
```

### Groq (Fast, Free Tier)
```env
GROQ_API_KEY=your_key_from_console.groq.com
```

Both keys are optional. The fallback generates realistic mock itineraries automatically.

---

## 🌐 API Endpoints (1000+)

| Module              | Base URL                   | Key Endpoints |
|---------------------|----------------------------|---------------|
| Auth                | `/api/auth`                | register, login, me |
| AI Trip Planner     | `/api/trips`               | generate, list, get, update |
| Flights             | `/api/flights`             | search, track, airports |
| Hotels              | `/api/hotels`              | search, get, ai-recommend |
| Transport           | `/api/transport`           | search, metro, nearby |
| Expense Tracker     | `/api/expense`             | list, add, summary, convert |
| AI Chatbot          | `/api/chatbot`             | chat, voice, suggestions |
| Translator          | `/api/translate`           | text, languages, detect |
| Social Feed         | `/api/social`              | feed, posts, like |
| Group Travel        | `/api/groups`              | create, invite, poll |
| Marketplace         | `/api/marketplace`         | list, create |
| Maps & GPS          | `/api/maps`                | geocode, directions, pois |
| Emergency           | `/api/emergency`           | contacts, sos, hospitals |
| AI Content Creator  | `/api/content`             | blog, caption, packing-list |
| Gamification        | `/api/gamification`        | badges, leaderboard, award-xp |
| Notifications       | `/api/notifications`       | list, mark-read |

Full Swagger UI: **http://localhost:8000/api/docs**

---

## 📱 Features

| Module | Description |
|--------|-------------|
| 🤖 AI Trip Planner | Generate complete day-by-day itineraries with Gemini/Groq AI |
| ✈️ Flights | Search, compare, book, and track flights |
| 🏨 Hotels | Search hotels/resorts/hostels with filters and AI recommendations |
| 🚌 Transport | Train, bus, taxi, car rental, metro, ferry search |
| 📍 Maps & GPS | Directions, geocoding, nearby POIs, route optimization |
| 💰 Expense Tracker | Log expenses with currency conversion and category analytics |
| 🤖 AI Chatbot | 24/7 AI travel assistant with context-aware responses |
| 🌍 Translator | 100+ language translation powered by AI |
| 📸 Social Feed | Share travel posts, photos, stories with the community |
| 🛒 Marketplace | Book local tours, guides, and unique experiences |
| 🆘 Emergency | SOS alerts, emergency contacts, nearest hospitals |
| ✍️ Content AI | Generate travel blogs, social captions, and packing lists |
| 🏆 Gamification | XP points, travel badges, global leaderboard |
| 🔔 Notifications | Real-time alerts for bookings, social, emergencies |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State Management | Zustand, TanStack Query |
| Routing | React Router v6 |
| Backend | FastAPI (Python 3.11+) |
| Database | SQLite (dev) → PostgreSQL (prod) |
| ORM | SQLAlchemy 2.0 async |
| Auth | JWT (python-jose) + bcrypt |
| AI | Google Gemini, Groq (Llama 3), Mock fallback |
| HTTP Client | Axios (frontend), HTTPX (backend) |

---

## 🔧 Production Deployment

### Backend (Railway / Render / EC2)
```bash
# Switch to PostgreSQL
DATABASE_URL=postgresql+asyncpg://user:pass@host/db

# Set secure JWT secret
JWT_SECRET_KEY=your-super-secret-key-here

# Run with gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend (Vercel / Netlify)
```bash
npm run build
# Deploy dist/ folder
# Set VITE_API_URL env var to your backend URL
```

---

## 📄 License
MIT License — built with ❤️ using Voyager AI
