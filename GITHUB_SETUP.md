# 🚀 GitHub Deployment Guide

This guide will help you push your MoviePopcorn project to GitHub.

## 📋 Prerequisites

1. **Git installed** on your computer
   - Check: `git --version`
   - Download: https://git-scm.com/downloads

2. **GitHub account**
   - Sign up: https://github.com/signup

3. **GitHub CLI** (optional but recommended)
   - Download: https://cli.github.com/
   - Check: `gh --version`

## 🔧 Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open your terminal in the project root directory:

```bash
cd /path/to/your/project
git init
```

### Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files

```bash
git add .
```

This adds all files except those in `.gitignore`.

### Step 4: Create First Commit

```bash
git commit -m "Initial commit: MoviePopcorn streaming platform"
```

### Step 5: Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**

```bash
gh repo create moviepopcorn --public --source=. --remote=origin --push
```

**Option B: Manual Method**

1. Go to https://github.com/new
2. Repository name: `moviepopcorn`
3. Description: `Modern movie and TV show streaming platform`
4. Choose **Public** or **Private**
5. **DON'T** initialize with README (we already have one)
6. Click "Create repository"
7. Copy the repository URL (e.g., `https://github.com/yourusername/moviepopcorn.git`)

Then run:

```bash
git remote add origin https://github.com/yourusername/moviepopcorn.git
git branch -M main
git push -u origin main
```

### Step 6: Verify

Go to your GitHub repository page and refresh. You should see all your project files!

## 🔄 Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit with descriptive message
git commit -m "Add new feature: search suggestions"

# Push to GitHub
git push
```

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good examples
git commit -m "Add video player with custom controls"
git commit -m "Fix search autocomplete bug"
git commit -m "Update README with installation instructions"
git commit -m "Refactor user authentication logic"

# Bad examples
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

## 🌿 Branching Strategy (Optional)

For larger changes, use branches:

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make your changes
git add .
git commit -m "Add new feature"

# Push branch to GitHub
git push -u origin feature/new-feature

# Switch back to main
git checkout main

# Merge when ready
git merge feature/new-feature
git push
```

## 🔒 Security Notes

Before pushing, verify these files are NOT included:

- ✅ `.env` files (already in `.gitignore`)
- ✅ `node_modules/` (already in `.gitignore`)
- ✅ API keys (should be in `.env` files)
- ✅ Personal data

## 📦 What's Included

Your repository will include:

- ✅ Source code (`src/`)
- ✅ Configuration files
- ✅ README.md
- ✅ LICENSE
- ✅ .gitignore
- ✅ Documentation

## 🚨 Troubleshooting

### Issue: "fatal: remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/yourusername/moviepopcorn.git
```

### Issue: "Updates were rejected because the remote contains work"

```bash
git pull origin main --rebase
git push origin main
```

### Issue: Permission denied (publickey)

```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/yourusername/moviepopcorn.git
```

## 🎯 Next Steps

After pushing to GitHub:

1. **Deploy to Vercel** (Recommended)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Deploy to Netlify**
   - Connect GitHub repo to Netlify
   - Auto-deploys on push

3. **Deploy to GitHub Pages**
   ```bash
   npm run build
   # Configure GitHub Pages in repository settings
   ```

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)

## ✅ Checklist

Before pushing, ensure:

- [ ] All sensitive data is in `.env` files
- [ ] `.gitignore` is properly configured
- [ ] README.md is complete
- [ ] Project builds successfully (`npm run build`)
- [ ] No console errors
- [ ] All features tested

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above!
