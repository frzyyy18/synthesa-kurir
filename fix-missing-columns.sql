# 1. Build & test locally
npm run dev  # Verify app works (localhost:5173)

# 2. Commit changes
git add .
git commit -m "fix: standardize field names to camelCase in UI"

# 3. Deploy to Vercel
npm run build
vercel --prod
