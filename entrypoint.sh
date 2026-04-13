#!/bin/sh
# Start API server in background
node /app/api/server.cjs &

# Start nginx in foreground
nginx -g "daemon off;"
