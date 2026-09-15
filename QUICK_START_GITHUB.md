# Quick GitHub Setup

## 🚀 Fast Track (Copy & Paste)

Run these commands in your terminal:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: MoviePopcorn streaming platform"

# 4. Create GitHub repo and push (requires GitHub CLI)
gh repo create moviepopcorn --public --source=. --remote=origin --push
```

**Don't have GitHub CLI?** Use this instead for step 4:

```bash
# 4a. Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/moviepopcorn.git
git branch -M main
git push -u origin main
```

## ✅ That's It!

Your project is now on GitHub! 🎉

## 📝 What's Next?

1. Go to https://github.com/YOUR_USERNAME/moviepopcorn
2. Refresh the page
3. You should see all your project files

## 🔄 Making Changes Later

```bash
# Make your changes, then:
git add .
git commit -m "Describe your changes"
git push
```

## 📖 Need More Help?

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for detailed instructions.
