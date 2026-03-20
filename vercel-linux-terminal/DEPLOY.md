# Quick Deployment Guide

## Overview
This project has two parts:
1. **Backend**: Vercel serverless function that executes Linux commands
2. **Frontend**: HTML file that runs locally in your browser

## 🚀 Deploy Backend to Vercel (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Clone/Download Project
Make sure you have the entire `vercel-linux-terminal` directory

### Step 3: Navigate to Project
```bash
cd vercel-linux-terminal
```

### Step 4: Login to Vercel
```bash
vercel login
```
This will open a browser to authenticate. Follow the prompts.

### Step 5: Deploy
```bash
vercel --prod
```

You'll see output like:
```
Vercel CLI 28.0.0
? Set up and deploy "~/vercel-linux-terminal"? [Y/n] y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] n
? What's your project's name? vercel-linux-terminal
? In which directory is your code located? ./
```

Just press Enter for defaults or customize as needed.

### Step 6: Get Your URL
After deployment completes, you'll see:
```
✓ Production: https://vercel-linux-terminal-xxxxx.vercel.app [in 15s]
```

Copy this URL. You'll need it for the frontend.

## 🖥️ Setup Frontend (1 minute)

### Step 1: Open the HTML file
```bash
firefox index.html
```
or
```bash
open index.html  # macOS
start index.html # Windows
```

### Step 2: Update API URL
In the browser, you'll see a text input that says:
```
API URL (Your Vercel deployment):
https://vercel-linux-terminal-eight.vercel.app/api/execute
```

Replace this with YOUR Vercel URL. Format:
```
https://YOUR-PROJECT-NAME.vercel.app/api/execute
```

### Step 3: Start Using!
Type a command in the input box and press Enter:
```
ls -la
cat /etc/os-release
pwd
whoami
df -h
```

## ✅ What You Can Do

The backend supports these commands:
- **File listing**: `ls`, `ls -la`, `ls /tmp`
- **View files**: `cat file.txt`, `head -20 file.txt`
- **File operations**: `mkdir`, `touch`, `cp`, `mv`, `rm`
- **System info**: `whoami`, `date`, `uname -a`, `df -h`, `ps aux`
- **Text tools**: `grep`, `find`, `wc`, `sort`, `sed`, `awk`
- **Development**: `node --version`, `npm --version`, `git status`
- **Network**: `curl https://example.com`, `wget`
- **Compression**: `tar`, `zip`, `unzip`

## 🛡️ Security Notes

This setup includes:
- ✅ Command allowlist (only safe commands allowed)
- ✅ 30-second execution timeout
- ✅ 10MB output limit
- ✅ CORS enabled for local access

For production use, you'd want to:
- Add authentication
- Restrict to specific IPs
- Further limit allowed commands
- Add rate limiting

## 🐛 Troubleshooting

### "Command not found"
The command isn't in the allowlist. Edit `api/execute.js` and add it to `ALLOWED_COMMANDS`.

### "Can't reach API"
1. Check your API URL is correct in the frontend
2. Verify deployment succeeded with `vercel list`
3. Try opening the API URL directly in browser (should show error page)

### "Output is incomplete"
Increase `maxBuffer` in `api/execute.js` and redeploy:
```javascript
maxBuffer: 50 * 1024 * 1024 // 50MB
```

### "Command timing out"
Increase timeout in `api/execute.js` and redeploy:
```javascript
timeout: 60000 // 60 seconds
```

## 📝 Advanced: Adding More Commands

Edit `api/execute.js` and add to `ALLOWED_COMMANDS`:
```javascript
const ALLOWED_COMMANDS = [
  'ls', 'pwd', 'echo', 'cat', 'mkdir', 'rm',
  'my-new-command' // Add here
];
```

Then redeploy:
```bash
vercel --prod
```

## 🌐 Share Your Terminal

Your deployment URL is now live! You can:
- Share the frontend HTML with anyone
- They just need to enter your API URL
- Works on any machine with a browser

## Questions?

Check the full README.md for more details!
