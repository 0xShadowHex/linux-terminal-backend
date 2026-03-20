# Vercel Linux Terminal Backend

A serverless Linux terminal backend running on Vercel that executes real shell commands and streams output to a frontend interface.

## Features

- ✅ Real Linux command execution on Vercel serverless
- ✅ Command allowlist for security
- ✅ Streaming output to frontend
- ✅ 30-second timeout protection
- ✅ 10MB output buffer limit
- ✅ CORS enabled for local frontend access
- ✅ Zero-cost deployment on Vercel free tier

## Quick Start

### Backend Deployment (5 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from this directory:**
   ```bash
   vercel --prod
   ```

4. **Copy your deployment URL** (looks like `https://vercel-linux-terminal.vercel.app`)

### Frontend Setup

1. **Open the provided `index.html` in your browser**
2. **Update the API URL** in `index.html` with your Vercel deployment URL
3. **Start using the fake terminal!**

## Available Commands

The backend supports these commands:
- File operations: `ls`, `cat`, `mkdir`, `rm`, `cp`, `mv`, `touch`
- System info: `whoami`, `date`, `uname`, `df`, `du`, `ps`
- Text processing: `grep`, `find`, `head`, `tail`, `wc`, `sort`, `sed`, `awk`
- Development: `git`, `node`, `npm`, `curl`, `wget`
- Compression: `tar`, `zip`, `unzip`

## How It Works

1. Frontend sends HTTP POST request to `/api/execute`
2. Backend validates command against allowlist
3. Backend executes command in real Linux shell
4. Backend returns stdout/stderr
5. Frontend simulates typing animation with real output

## Configuration

Edit `api/execute.js` to:
- Add/remove allowed commands in `ALLOWED_COMMANDS`
- Adjust timeout (currently 30 seconds)
- Adjust max buffer size (currently 10MB)

## API Reference

**Endpoint:** `POST /api/execute`

**Request:**
```json
{
  "command": "ls -la"
}
```

**Response (Success):**
```json
{
  "success": true,
  "output": "total 48\ndrwxr-xr-x 5 user user 4096 Mar 20 10:00 .\n...",
  "error": null
}
```

**Response (Error):**
```json
{
  "success": false,
  "output": "some output before error",
  "error": "command not found",
  "code": 127
}
```

## Security Notes

⚠️ **Important:** This is for development/demo purposes. In production:
- Implement proper authentication
- Further restrict command allowlist
- Rate limit API calls
- Monitor for malicious patterns
- Run in isolated container with restricted permissions

## Local Development

```bash
vercel dev
```

This starts a local dev server at `http://localhost:3000/api/execute`

## Troubleshooting

**Commands not executing:**
- Check command is in `ALLOWED_COMMANDS` list
- Verify no typos in command

**Frontend can't reach backend:**
- Ensure CORS is enabled (it is by default)
- Check API URL is correct in `index.html`
- Check browser console for errors

**Output getting cut off:**
- Increase `maxBuffer` in `api/execute.js`
- Consider breaking command into smaller chunks

## License

MIT
