-- ============================================
-- コーヒー豆ログ公開WEBサイト データベース定義
-- ============================================

-- ENUM型
CREATE TYPE roast_level AS ENUM (
  'light', 'medium_light', 'medium', 'medium_dark', 'dark'
);

CREATE TYPE brew_method AS ENUM (
  'drip', 'pour_over', 'french_press', 'espresso',
  'aeropress', 'cold_brew', 'siphon', 'moka_pot', 'other'
);

-- usersテーブル
CREATE TABLE users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle      text NOT NULL UNIQUE CHECK (handle ~ '^[a-z][a-z0-9_]{2,19}$'),
  display_name text NOT NULL,
  bio         text DEFAULT '',
  avatar_url  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- coffee_logsテーブル
CREATE TABLE coffee_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id   text NOT NULL UNIQUE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consumed_at timestamptz NOT NULL DEFAULT now(),
  bean_name   text NOT NULL,
  roaster_name text NOT NULL DEFAULT '',
  origin_text text NOT NULL DEFAULT '',
  roast_level roast_level NOT NULL DEFAULT 'medium',
  brew_method brew_method NOT NULL DEFAULT 'pour_over',
  rating      int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  notes       text DEFAULT '',
  image_url   text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_coffee_logs_user_id ON coffee_logs(user_id);
CREATE INDEX idx_coffee_logs_consumed_at ON coffee_logs(consumed_at DESC);

-- ============================================
-- RLS (Row Level Security) ポリシー
-- ============================================

-- users テーブル
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: 誰でも閲覧可" ON users
  FOR SELECT USING (true);

CREATE POLICY "users: 本人のみ挿入" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users: 本人のみ更新" ON users
  FOR UPDATE USING (auth.uid() = id);

-- coffee_logs テーブル
ALTER TABLE coffee_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coffee_logs: 誰でも閲覧可" ON coffee_logs
  FOR SELECT USING (true);

CREATE POLICY "coffee_logs: ログインユーザーのみ挿入" ON coffee_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coffee_logs: 本人のみ更新" ON coffee_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "coffee_logs: 本人のみ削除" ON coffee_logs
  FOR DELETE USING (auth.uid() = user_id);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER coffee_logs_updated_at
  BEFORE UPDATE ON coffee_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
