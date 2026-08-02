import { Router } from 'express';
import { db } from '../db/connection';

// interface PlayerBody {
//   name?: string;
//   rating?: number;
// }

// function parseId(params: Record<string, string | string[] | undefined>): number {
//   const id = Number(params['id']);
//   if (!Number.isInteger(id)) {
//     throw Object.assign(new Error('Invalid id'), { status: 400 });
//   }
//   return id;
// }

const router: Router = Router({ mergeParams: true });

router.get('/', (_, res) => {
  db.any('SELECT * FROM players ORDER BY id').then((players) => {
    res.json(players);
  });
});

router.get('/:id', (req, res) => {
  const playerId = req.params.id;
  db.oneOrNone('SELECT * FROM players WHERE id = $1', [playerId]).then(
    (player) => {
      if (player) {
        res.json(player);
      } else {
        res.status(404).json({ error: 'Player not found' });
      }
    },
  );
});

export { router };

// export function createRouter(): Router {
//   const router = Router();

//   router.get('/', asyncHandler(async (_req, res) => {
//     const players = await db.any('SELECT * FROM players ORDER BY id');
//     res.json(players);
//   }));

//   router.get('/:id', asyncHandler(async (req, res) => {
//     const id = parseId(req.params);
//     const player = await db.oneOrNone('SELECT * FROM players WHERE id = $1', [id]);
//     if (!player) {
//       res.status(404).json({ error: 'Player not found' });
//       return;
//     }
//     res.json(player);
//   }));

//   router.post('/', asyncHandler(async (req, res) => {
//     const body = req.body as PlayerBody;
//     if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
//       res.status(400).json({ error: 'name is required' });
//       return;
//     }
//     const player = await db.one(
//       'INSERT INTO players (name, rating) VALUES ($1, $2) RETURNING *',
//       [body.name.trim(), body.rating ?? 1000],
//     );
//     res.status(201).json(player);
//   }));

//   router.put('/:id', asyncHandler(async (req, res) => {
//     const id = parseId(req.params);
//     const body = req.body as PlayerBody;
//     const existing = await db.oneOrNone('SELECT * FROM players WHERE id = $1', [id]);
//     if (!existing) {
//       res.status(404).json({ error: 'Player not found' });
//       return;
//     }
//     const name = body.name !== undefined ? body.name : existing.name;
//     const rating = body.rating !== undefined ? body.rating : existing.rating;
//     const player = await db.one(
//       'UPDATE players SET name = $1, rating = $2 WHERE id = $3 RETURNING *',
//       [name, rating, id],
//     );
//     res.json(player);
//   }));

//   router.delete('/:id', asyncHandler(async (req, res) => {
//     const id = parseId(req.params);
//     const result = await db.result('DELETE FROM players WHERE id = $1', [id]);
//     if (result.rowCount === 0) {
//       res.status(404).json({ error: 'Player not found' });
//       return;
//     }
//     res.status(204).send();
//   }));

//   return router;
// }
