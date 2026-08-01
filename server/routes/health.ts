import { Router } from 'express';

export function createRouter(): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });

  return router;
}
