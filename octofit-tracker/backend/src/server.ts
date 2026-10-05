import express from 'express';
import { connectDatabase } from './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';
import { createResourceRouter } from './routes/resources.js';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const frontendOrigin = codespaceName
  ? `https://${codespaceName}-5173.app.github.dev`
  : 'http://localhost:5173';

app.use(express.json());
app.use((request, response, next) => {
  if (request.get('Origin') === frontendOrigin) {
    response.setHeader('Access-Control-Allow-Origin', frontendOrigin);
    response.setHeader('Vary', 'Origin');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', apiBaseUrl });
});

app.use('/api/users', createResourceRouter(User));
app.use('/api/teams', createResourceRouter(Team));
app.use('/api/activities', createResourceRouter(Activity));
app.use('/api/leaderboard', createResourceRouter(LeaderboardEntry));
app.use('/api/workouts', createResourceRouter(Workout));

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: 'Invalid JSON request body' });
    return;
  }

  if (error instanceof Error && error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
    return;
  }

  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${apiBaseUrl}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});
