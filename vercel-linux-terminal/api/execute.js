const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const ALLOWED_COMMANDS = [
  'ls', 'pwd', 'echo', 'cat', 'mkdir', 'rm', 'cp', 'mv', 'touch', 'chmod',
  'whoami', 'date', 'uname', 'df', 'du', 'ps', 'grep', 'find', 'tar',
  'zip', 'unzip', 'curl', 'wget', 'node', 'npm', 'git', 'head', 'tail',
  'wc', 'sort', 'uniq', 'sed', 'awk', 'cut', 'tr', 'tee', 'less', 'more'
];

function validateCommand(cmd) {
  const firstWord = cmd.trim().split(/\s+/)[0];
  return ALLOWED_COMMANDS.includes(firstWord);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { command } = req.body;

  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Command is required' });
  }

  if (!validateCommand(command)) {
    return res.status(403).json({ error: 'Command not allowed' });
  }

  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
      shell: '/bin/bash'
    });

    return res.status(200).json({
      success: true,
      output: stdout,
      error: stderr || null
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message,
      code: error.code || 1
    });
  }
};
