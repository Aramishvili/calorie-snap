# 🍎 Calorie Snap - Food Calorie Estimator

AI-powered food photo analyzer using Google Gemini to estimate calories.

## 🚀 Quick Start - Deploy to Vercel

### Step 1: Get Your Google Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy and save it somewhere safe

### Step 2: Upload to GitHub

**Option A: GitHub Website (Recommended for beginners)**
1. Go to https://github.com and sign in
2. Click **"New"** (or the + icon) → **"New repository"**
3. Name it: `calorie-snap`
4. Keep it **Public** (or Private, your choice)
5. **DO NOT** check "Add a README file"
6. Click **"Create repository"**
7. You'll see a page with instructions - **IGNORE THEM**
8. Click **"uploading an existing file"** link
9. Drag ALL files from this folder
10. Click **"Commit changes"**

**Option B: Using Git Commands**
```bash
# In this folder, run:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/calorie-snap.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Click **"Continue with GitHub"** and sign in
3. Click **"Add New"** → **"Project"**
4. Find your **"calorie-snap"** repository
5. Click **"Import"**
6. Vercel will show settings:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)
7. **DON'T CLICK DEPLOY YET!**

### Step 4: Add Environment Variables (IMPORTANT!)
Still on the import screen:
1. Scroll down to **"Environment Variables"**
2. Click to expand it
3. Add **Variable 1**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Paste your API key from Step 1
4. Add **Variable 2**:
   - **Name**: `APP_PASSWORD`
   - **Value**: Choose any password (e.g., `MySecure123`)
5. NOW click **"Deploy"**

### Step 5: Wait for Deployment
- Vercel will build your app (takes 1-2 minutes)
- When done, you'll see "🎉 Congratulations"
- Click **"Visit"** to see your app!

## 📱 How to Use

1. Open your deployed URL
2. Enter the password you set in Step 4
3. Take or upload a food photo
4. Click **"Analyze"**
5. See calorie estimates!

## 🔧 Local Development

If you want to test locally before deploying:

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env and add your API keys
# GEMINI_API_KEY=your_key_here
# APP_PASSWORD=your_password_here

# Run development server
npm run dev
```

Open http://localhost:5173 in your browser.

**Note**: In development mode, it uses **mock data** instead of real API calls.

## 🐛 Troubleshooting

### "Blank page" after deployment
- Check Vercel deployment logs for errors
- Verify environment variables are set
- Make sure you deployed from the correct folder

### "Unauthorized" error when analyzing
- Clear your browser cache/localStorage
- Re-enter the password
- Check that `APP_PASSWORD` matches in Vercel settings

### "API key not configured"
- Verify `GEMINI_API_KEY` is set in Vercel
- Check no typos in the variable name
- Redeploy after adding variables

### Build fails on Vercel
- Check that all files uploaded correctly to GitHub
- Verify `package.json` exists in the root
- Check Vercel build logs for specific errors

## 📁 Project Structure

```
calorie-snap/
├── api/
│   └── analyze-food.js      # Serverless function for Gemini API
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Styles
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── .env.example             # Environment variables template
```

## 🔒 Security

- ✅ API key stored securely in environment variables
- ✅ Password validation on server side
- ✅ `.env` excluded from Git
- ✅ Never commit secrets to GitHub

**IMPORTANT**: 
- Your API key and password are ONLY in Vercel settings
- They are NOT in your code
- They are NOT on GitHub
- Keep them secret!

## ⚙️ Features

- 📸 Camera/photo upload support
- 🔐 Password protection
- 🤖 AI-powered calorie estimation
- 📊 Multiple food item detection
- 📏 Portion size estimates
- 📱 Mobile-friendly
- ⚡ Fast analysis with Gemini 1.5 Flash

## 🆘 Need Help?

1. Check the error in browser console (F12)
2. Check Vercel deployment logs
3. Verify environment variables are set correctly
4. Make sure your Gemini API key is valid

## 📝 Notes

- Calorie estimates are ranges, not exact values
- Works best with clear, well-lit food photos
- Supports multiple food items in one photo
- Free tier of Gemini API has rate limits
