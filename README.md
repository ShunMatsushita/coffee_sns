# ☕ BeanLog — コーヒー豆ログ公開WEBサービス

飲んだコーヒー豆の記録を保存し、公開URLで誰とでも共有できるWebサービスです。

## 機能

- **ログ記録** — 豆名・ロースター・産地・焙煎度・抽出方法・評価・メモを記録
- **公開URL共有** — 各ログに固定の公開URL (例: `/log/aBcDeFgH1234`) を発行
- **OGP対応** — SNSにリンクを貼ると豆名・評価がリッチプレビュー表示
- **公開プロフィール** — `/u/{handle}` でログ一覧を公開
- **認証** — サインアップ / ログイン / ログアウト

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js (App Router, TypeScript) |
| バックエンド | Supabase (Auth / Postgres / Storage) |
| OGP画像生成 | Next.js ImageResponse (Edge Runtime) |
| デザイン | Vanilla CSS (Dark Mode) |

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Supabase プロジェクトの準備

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. `.env.local.example` を `.env.local` にコピーし、実際の値を設定:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. データベースの初期化

Supabase SQL Editor で以下を実行:

```
supabase/migrations/001_create_tables.sql
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## URL構造

| パス | 説明 |
|------|------|
| `/` | ランディングページ |
| `/signup` | アカウント作成 |
| `/login` | ログイン |
| `/dashboard` | ログ一覧 (要認証) |
| `/dashboard/new` | ログ追加 |
| `/dashboard/edit/[id]` | ログ編集 |
| `/dashboard/settings` | プロフィール設定 |
| `/log/[public_id]` | ログ詳細 (公開・OGP対応) |
| `/u/[handle]` | プロフィール (公開) |
| `/api/og/log/[public_id]` | OGP画像自動生成 |

## 要件定義

- [要件定義（MVP）](docs/requirements.md)