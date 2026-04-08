#!/bin/bash
# AUW Dining System — macOS Setup Script
# Run: chmod +x setup.sh && ./setup.sh

set -e

echo ""
echo "🍽️  AUW Dining Management System — Setup"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install it from https://nodejs.org or run: brew install node"
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js v18+ required. Current: $(node -v)"
  exit 1
fi

echo "✅ Node.js $(node -v) found"
echo ""

# Backend
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo "✅ Backend ready"
cd ..

# Frontend
echo "📦 Installing frontend dependencies..."
cd frontend && npm install
echo "✅ Frontend ready"
cd ..

echo ""
echo "==========================================="
echo "✅ Setup complete!"
echo ""
echo "📌 Add these files to frontend/public/:"
echo "   • auw-logo.png   (AUW lotus logo)"
echo "   • campus-bg.jpg  (campus aerial photo)"
echo ""
echo "🚀 To start the app, open TWO terminal windows:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "🌐 Then open: http://localhost:5173"
echo ""
echo "🔑 Demo login: ID = 220018  |  Password = auw2024"
echo "==========================================="
