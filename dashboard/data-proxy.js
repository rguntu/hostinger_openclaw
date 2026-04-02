import express from 'express';
import { execSync } from 'child_process';
import cors from 'cors';

const app = express();
const port = 18790; // Dedicated data port to avoid Gateway UI hijacking

app.use(cors());

const safeExec = (cmd) => {
  try {
    const raw = execSync(cmd, { encoding: 'utf8', timeout: 5000 });
    return JSON.parse(raw);
  } catch (e) {
    console.error(`CLI Error [${cmd}]:`, e.message);
    return []; // Return empty array for lists to prevent frontend crash
  }
};

app.get('/health', (req, res) => {
  const result = safeExec('openclaw health --json');
  res.json(result.error ? { ok: false } : result);
});

app.get('/agents/list', (req, res) => {
  res.json(safeExec('openclaw agents list --json'));
});

app.get('/cron/list', (req, res) => {
  res.json(safeExec('openclaw cron list --json'));
});

app.get('/sessions/list', (req, res) => {
  const limit = req.query.limit || 10;
  res.json(safeExec(`openclaw sessions list --limit ${limit} --json`));
});

app.listen(port, '127.0.0.1', () => {
  console.log(`JSON Data Proxy running on http://127.0.0.1:${port}`);
});
