#!/bin/bash
# Ash-Fall Repository Cleanup Script
# This will clean up your repo and remove junk files

set -e  # Exit on any error

echo "🔥 Ash-Fall Repository Cleanup Starting..."
echo ""

# Check if we're in a git repo
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository!"
    echo "Please run this script from your Ash-Fall folder"
    exit 1
fi

echo "Step 1: Removing log files..."
git rm ash-fall.77c016f0-72d1-494b-a1f1-69ee87cb5279.log.txt 2>/dev/null || echo "  (log file 1 already gone)"
git rm ash-fall.f8c33417-daa8-4efe-a7ab-ab0f663c5bd7.log.txt 2>/dev/null || echo "  (log file 2 already gone)"
git rm risefromtheashes.production.56cce0b2-245d-4cd1-b4e8-938ff62b0adb.build.log.txt 2>/dev/null || echo "  (log file 3 already gone)"

echo "Step 2: Removing node_modules..."
git rm -r node_modules/ 2>/dev/null || echo "  (node_modules already gone)"

echo "Step 3: Removing backend folder..."
git rm -r backend/ 2>/dev/null || echo "  (backend already gone)"

echo "Step 4: Removing wrangler.toml..."
git rm wrangler.toml 2>/dev/null || echo "  (wrangler.toml already gone)"

echo "Step 5: Creating proper .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js
package-lock.json

# Logs
*.log
*.log.txt
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.production
.env.*.local
.env.baseai

# Editor
.DS_Store
.vscode/
.idea/
*.swp
*.swo

# Cloudflare
.wrangler/
wrangler.toml.backup
.dev.vars

# OS
Thumbs.db
EOF

git add .gitignore

echo "Step 6: Committing changes..."
git commit -m "Clean up repository - remove logs, node_modules, and backend folder"

echo "Step 7: Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Your repo is now clean. Next steps:"
echo "1. Run 'npm install' to recreate node_modules locally (won't be committed)"
echo "2. I'll help you set up the /functions folder for your forum"
echo ""
