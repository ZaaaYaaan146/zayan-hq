#!/bin/bash
export PATH="/home/ubuntu/.npm-global/bin:/home/ubuntu/.local/share/pnpm:$PATH"
cd /home/ubuntu/.openclaw/workspace/zayan-hq
export NODE_ENV=production
exec pnpm start --port 3456
