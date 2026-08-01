CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rating INT DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  player_a_id INT REFERENCES players(id),
  player_b_id INT REFERENCES players(id),
  winner_id INT REFERENCES players(id),
  score TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
