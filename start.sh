#!/bin/bash
# ─────────────────────────────────────────────────
# Voyager AI – Start both backend and frontend
# Usage: bash start.sh
# ─────────────────────────────────────────────────

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}✈️  Voyager AI – Starting...${NC}"
echo "════════════════════════════════════"

# ── Backend ──
echo -e "${YELLOW}→ Starting FastAPI backend on :8000${NC}"
cd backend

if [ ! -d "venv" ]; then
  echo "  Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "  Created .env from .env.example"
fi

python main.py &
BACKEND_PID=$!
echo -e "${GREEN}  ✓ Backend running (PID $BACKEND_PID)${NC}"

# ── Frontend ──
cd ../frontend
echo -e "${YELLOW}→ Starting React frontend on :3000${NC}"

if [ ! -d "node_modules" ]; then
  echo "  Installing npm packages..."
  npm install -q
fi

npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}  ✓ Frontend running (PID $FRONTEND_PID)${NC}"

echo ""
echo "════════════════════════════════════"
echo -e "${GREEN}🚀 Voyager AI is ready!${NC}"
echo ""
echo -e "  App:      ${BLUE}http://localhost:3000${NC}"
echo -e "  API Docs: ${BLUE}http://localhost:8000/api/docs${NC}"
echo ""
echo "Press Ctrl+C to stop all services"
echo "════════════════════════════════════"

# Wait and handle shutdown
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" SIGINT SIGTERM
wait
