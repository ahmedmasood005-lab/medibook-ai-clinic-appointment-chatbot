# GitHub Upload Guide

This folder is sanitized and ready for GitHub. It does not contain `.env.local`, API keys, `node_modules`, generated clinic data, caches, or build output.

## Upload with GitHub website

1. Create a new empty repository on GitHub.
2. Open the repository and choose **Add file → Upload files**.
3. Upload the contents of this folder. Do not upload the outer folder as a single ZIP.
4. Commit the files to the `main` branch.

## Upload with Git in VS Code

Open this folder in VS Code, then run:

```powershell
git init
git add .
git commit -m "Initial MediBook AI project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## After cloning

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run db:seed
npm.cmd run dev
```

Add real values only to `.env.local`. Never commit that file.

Required private variables:

- `OPENAI_API_KEY`
- `SESSION_SECRET`
- `DATABASE_URL`

## GitHub repository settings

For deployment or CI, add secrets under **Settings → Secrets and variables → Actions**. Never paste credentials into source files, Issues, screenshots, or commits.
