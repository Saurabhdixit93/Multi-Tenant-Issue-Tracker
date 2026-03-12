#!/bin/bash

# --- RUDRATEK V1: Multi-Tenant Issue Tracker Orchestrator ---
# This script handles the lifecycle of both Backend and Frontend services.

# Configuration
BACKEND_PORT=3001
FRONTEND_PORT=3000
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Colors for professional logging
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting RUDRATEK V1 Orchestrator ===${NC}"

# Function to kill process on a port
kill_port() {
  local port=$1
  local pid=$(lsof -ti :$port)
  if [ ! -z "$pid" ]; then
    echo -e "${RED}Stopping existing process on port $port (PID: $pid)...${NC}"
    kill -9 $pid
  fi
}

# 1. Cleanup existing processes
echo -e "${BLUE}1. Cleaning up ports...${NC}"
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# 2. Start Backend
echo -e "${BLUE}2. Starting Backend Service (localhost:$BACKEND_PORT)...${NC}"
cd $BACKEND_DIR
npm run dev &
BACKEND_PID=$!
cd ..

# 3. Wait a moment for backend initialization
sleep 2

# 4. Start Frontend
echo -e "${BLUE}3. Starting Frontend Service (localhost:$FRONTEND_PORT)...${NC}"
cd $FRONTEND_DIR
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}SUCCESS: Both services are booting up!${NC}"
echo -e "${GREEN}Backend: http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${BLUE}Press Ctrl+C to stop all services.${NC}"

# Handle teardown on script exit
trap "echo -e '${RED}Stopping services...${NC}'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# Keep script running
wait
