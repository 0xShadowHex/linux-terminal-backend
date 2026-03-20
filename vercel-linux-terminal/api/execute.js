import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Allowlist of safe commands to prevent abuse
const ALLOWED_COMMANDS = [
  'ls', 'pwd', 'echo', 'cat', 'mkdir', 'rm', 'cp', 'mv', 'touch', 'chmod',
  'whoami', 'date', 'uname', 'df', 'du', 'ps', 'grep', 'find', 'tar',
  'zip', 'unzip', 'curl', 'wget', 'node', 'npm', 'git', 'head', 'tail',
  'wc', 'sort', 'uniq', 'sed', 'awk', 'cut', 'tr', 'tee', 'pipe', 'chmod'
];

function validateCommand(cmd) {
  const firstWord = cmd.trim().split(/\s+/)[0];
  return ALLOWED_COMMANDS.includes(firstWord);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Command is required' });
  }

  // Validate command
  if (!validateCommand(command)) {
    return res.status(403).json({ error: 'Command not allowed' });
  }

  try {
    // Execute with timeout and size limits
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB max output
      shell: '/bin/bash'
    });

    res.status(200).json({
      success: true,
      output: stdout,
      error: stderr || null
    });
  } catch (error) {
    // Command execution error (non-zero exit code)
    res.status(200).json({
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message,
      code: error.code || 1
    });
  }
}
