# ✅ Deployment Checklist

## Before You Start
- [ ] Get Gemini API Key from https://aistudio.google.com/app/apikey
- [ ] Choose a password for your app

## Step-by-Step

### 1️⃣ Upload to GitHub
- [ ] Create new repository named `calorie-snap`
- [ ] Upload ALL files from this folder
- [ ] Commit changes

### 2️⃣ Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] Click "Add New" → "Project"
- [ ] Import your `calorie-snap` repository
- [ ] Vercel should auto-detect "Vite" framework ✅

### 3️⃣ Add Environment Variables (CRITICAL!)
Before clicking "Deploy", add these:
- [ ] `GEMINI_API_KEY` = Your API key
- [ ] `APP_PASSWORD` = Your chosen password
- [ ] Click "Deploy"

### 4️⃣ Test
- [ ] Wait for build to complete
- [ ] Click "Visit" 
- [ ] Enter your password
- [ ] Upload a food photo
- [ ] Click "Analyze"
- [ ] See results! 🎉

## If Something Goes Wrong

### Blank Page?
1. Check browser console (F12)
2. Look for red errors
3. Check Vercel deployment logs

### "Unauthorized" Error?
1. Verify password is correct
2. Check `APP_PASSWORD` in Vercel settings
3. Try clearing browser cache

### "API key not configured"?
1. Check `GEMINI_API_KEY` in Vercel
2. Redeploy after adding it

## Important Notes

⚠️ **DO NOT** commit your `.env` file to GitHub
⚠️ Environment variables go in **Vercel settings**, not in code
✅ The `.gitignore` already protects your secrets
✅ All files are at root level - no nested folders

## What Changed from Original

✅ Removed nested folder structure (was causing blank page)
✅ Fixed `vite.config.js` (removed GitHub Pages base path)
✅ Added `vercel.json` for proper routing
✅ All files at root level for easy deployment
✅ Clear step-by-step instructions
