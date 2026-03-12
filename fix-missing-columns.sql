# 1. Jalankan manual (PowerShell tidak support && chaining):
git add .
git rm --cached TODO.md fix-missing-columns.sql create-documents-table.sql
git commit -m "Cleanup: Remove temporary debug files"
git push origin main

# 2. Deploy Vercel:
npm run build
vercel --prod
