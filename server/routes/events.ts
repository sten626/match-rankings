import { Router } from 'express';
import { db } from '../db/connection';
import { asyncHandler } from '../middleware/errorHandler';

interface EventBody {
  name?: string;
  date?: string;
}

function parseId(params: Record<string, string | string[] | undefined>): number {
  const id = Number(params['id']);
  if (!Number.isInteger(id)) {
    throw Object.assign(new Error('Invalid id'), { status: 400 });
  }
  return id;
}

export function createRouter(): Router {
  const router = Router();

  router.get('/', asyncHandler(async (_req, res) => {
    const events = await db.any('SELECT * FROM events ORDER BY id');
    res.json(events);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params);
    const event = await db.oneOrNone('SELECT * FROM events WHERE id = $1', [id]);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(event);
  }));

  router.post('/', asyncHandler(async (req, res) => {
    const body = req.body as EventBody;
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    const event = await db.one(
      'INSERT INTO events (name, date) VALUES ($1, $2) RETURNING *',
      [body.name.trim(), body.date ?? null],
    );
    res.status(201).json(event);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params);
    const body = req.body as EventBody;
    const existing = await db.oneOrNone('SELECT * FROM events WHERE id = $1', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    const name = body.name !== undefined ? body.name : existing.name;
    const date = body.date !== undefined ? body.date : existing.date;
    const event = await db.one(
      'UPDATE events SET name = $1, date = $2 WHERE id = $3 RETURNING *',
      [name, date, id],
    );
    res.json(event);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params);
    const result = await db.result('DELETE FROM events WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.status(204).send();
  }));

  return router;
}
