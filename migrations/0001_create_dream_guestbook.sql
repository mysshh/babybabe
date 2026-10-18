CREATE TABLE dream_guestbook (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL DEFAULT 'A little dreamer',
  wish TEXT NOT NULL,
  mood TEXT NOT NULL DEFAULT '💗',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_dream_guestbook_created_at ON dream_guestbook(created_at DESC);