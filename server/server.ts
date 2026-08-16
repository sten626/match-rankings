import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { closeDb } from './db/connection';
// import { errorHandler } from './middleware/errorHandler.js';
// import { createRouter as createHealthRouter } from './routes/health.js';
// import { createRouter as createPlayersRouter } from './routes/players.js';
// import { createRouter as createEventsRouter } from './routes/events.js';
// import { createRouter as createMatchesRouter } from './routes/matches.js';
import { router as playersRouter } from './routes/players';

const app = express();

app.use(express.json());

const corsOrigin = (process.env['CORS_ORIGIN'] ?? 'http://localhost:4200,http://127.0.0.1:4200')
  .split(',')
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

app.use(cors({ origin: corsOrigin }));

// app.use('/health', createHealthRouter());
// app.use('/api/players', createPlayersRouter());
// app.use('/api/events', createEventsRouter());
// app.use('/api/matches', createMatchesRouter());

// app.use(errorHandler);

// TODO: Error handling

app.use('/api/players', playersRouter);

const port = Number(process.env['PORT'] ?? 3000);
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function shutdown(signal: string): void {
  console.log(`Received ${signal}, shutting down...`);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
