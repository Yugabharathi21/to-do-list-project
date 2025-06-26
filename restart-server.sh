#!/bin/bash

# Restart script for Render Web Service
echo "Restarting server after fixing duplicate index issue..."

# Stop any running server processes
echo "Stopping server..."
pkill -f "node server/index.js" || true

# Start the server again
echo "Starting server..."
npm run server
