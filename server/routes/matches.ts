import { Router } from "express";
import { db } from "../db/connection";

// interface MatchBody {
//   event_id?: number;
//   player_a_id?: number;
//   player_b_id?: number;
//   winner_id?: number | null;
//   score?: string | null;
// }

// function parseId(params: Record<string, string | string[] | undefined>): number {
//   const id = Number(params['id']);
//   if (!Number.isInteger(id)) {
//     throw Object.assign(new Error('Invalid id'), { status: 400 });
//   }
//   return id;
// }

const router: Router = Router({ mergeParams: true });

router.get("/", (_, res) => {
  db.any("SELECT * FROM matches ORDER BY id").then((matches) => {
    res.json(matches);
  });
});

router.get("/:id", (req, res) => {
  const matchId = req.params.id;
  db.oneOrNone("SELECT * FROM matches WHERE id = $1", [matchId]).then(
    (match) => {
      if (match) {
        res.json(match);
      } else {
        res.status(404).json({ error: "Match not found" });
      }
    },
  );
});

export { router };

// export function createRouter(): Router {
//   const router = Router();

//   router.get('/', asyncHandler(async (_req, res) => {
//     const matches = await db.any(`
//       SELECT m.*,
//         ea.name AS player_a_name,
//         eb.name AS player_b_name,
//         e.name AS event_name
//       FROM matches m
//       LEFT JOIN players ea ON ea.id = m.player_a_id
//       LEFT JOIN players eb ON eb.id = m.player_b_id
//       LEFT JOIN events e ON e.id = m.event_id
//       ORDER BY m.id
//     `);
//     res.json(matches);
//   }));

//   router.get('/:id', asyncHandler(async (req, res) => {
//     const id = parseId(req.params);
//     const match = await db.oneOrNone(`
//       SELECT m.*,
//         ea.name AS player_a_name,
//         eb.name AS player_b_name,
//         e.name AS event_name
//       FROM matches m
//       LEFT JOIN players ea ON ea.id = m.player_a_id
//       LEFT JOIN players eb ON eb.id = m.player_b_id
//       LEFT JOIN events e ON e.id = m.event_id
//       WHERE m.id = $1
//     `, [id]);
//     if (!match) {
//       res.status(404).json({ error: 'Match not found' });
//       return;
//     }
//     res.json(match);
//   }));

//   router.post('/', asyncHandler(async (req, res) => {
//     const body = req.body as MatchBody;
//     if (
//       !Number.isInteger(body.event_id) ||
//       !Number.isInteger(body.player_a_id) ||
//       !Number.isInteger(body.player_b_id)
//     ) {
//       res.status(400).json({ error: 'event_id, player_a_id, and player_b_id are required' });
//       return;
//     }
//     const match = await db.one(
//       `INSERT INTO matches (event_id, player_a_id, player_b_id, winner_id, score)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [body.event_id, body.player_a_id, body.player_b_id, body.winner_id ?? null, body.score ?? null],
//     );
//     res.status(201).json(match);
//   }));

//   router.put('/:id', asyncHandler(async (req, res) => {
//     const id = parseId(req.params);
//     const body = req.body as MatchBody;
//     const existing = await db.oneOrNone('SELECT * FROM matches WHERE id = $1', [id]);
//     if (!existing) {
//       res.status(404).json({ error: 'Match not found' });
//       return;
//     }
//     const event_id = body.event_id !== undefined ? body.event_id : existing.event_id;
//     const player_a_id = body.player_a_id !== undefined ? body.player_a_id : existing.player_a_id;
//     const player_b_id = body.player_b_id !== undefined ? body.player_b_id : existing.player_b_id;
//     const winner_id = body.winner_id !== undefined ? body.winner_id : existing.winner_id;
//     const score = body.score !== undefined ? body.score : existing.score;
//     const match = await db.one(
//       `UPDATE matches SET event_id = $1, player_a_id = $2, player_b_id = $3, winner_id = $4, score = $5
//        WHERE id = $6 RETURNING *`,
//       [event_id, player_a_id, player_b_id, winner_id, score, id],
//     );
//     res.json(match);
//   }));

//   router.delete('/:id', asyncHandler(async (req, res) => {
//     const id = parseId(req.params);
//     const result = await db.result('DELETE FROM matches WHERE id = $1', [id]);
//     if (result.rowCount === 0) {
//       res.status(404).json({ error: 'Match not found' });
//       return;
//     }
//     res.status(204).send();
//   }));

//   return router;
// }
