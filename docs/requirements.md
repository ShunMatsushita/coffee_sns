# コーヒー豆ログ公開WEBサイト 要件定義（MVP確定版）

## 1. 目的
ユーザーが飲んだコーヒー豆の記録を保存し、各ログを **公開URL（/log/{public_id}）で共有できるWEBサービス** を提供する。  
本サービスは「公開ログサービス」として機能し、SNS機能（フォロー・いいね等）は含まない。

## 2. 公開仕様（重要）

### 2.1 公開範囲
- 全ユーザーのプロフィールとログは常に公開
- 非公開機能は提供しない（MVP）
- ログ削除時のみ非表示（404）

### 2.2 公開URL構造
#### ログ詳細（必須）
- `/log/{public_id}`
- 固定URL（変更不可）
- OGP完全対応
- 誰でも閲覧可能

#### プロフィール（必須）
- `/u/{handle}`
- 表示：表示名 / bio / アイコン / ログ一覧（新しい順）

## 3. handle仕様（確定）
- 使用可能文字：`a-z` `0-9` `_`
- 制約：3〜20文字、先頭は英字、ユニーク
- 正規表現：`^[a-z][a-z0-9_]{2,19}$`

有効例：`matsu`, `matsu_coffee`, `beanlog_jp`  
無効例：`1matsu`, `ma`, `matsu-coffee`

## 4. データ要件

### users テーブル
|列名|型|説明|
|---|---|---|
|id|uuid|PK|
|handle|text|公開ID（unique）|
|display_name|text|表示名|
|bio|text|自己紹介（任意）|
|avatar_url|text|アイコンURL（任意）|
|created_at|timestamp||
|updated_at|timestamp||

Index:
- UNIQUE(handle)

### coffee_logs テーブル
|列名|型|説明|
|---|---|---|
|id|uuid|PK|
|public_id|text|公開ID（unique）|
|user_id|uuid|FK(users.id)|
|consumed_at|timestamp|飲んだ日時|
|bean_name|text||
|roaster_name|text||
|origin_text|text||
|roast_level|text|enum|
|brew_method|text|enum|
|rating|int|1〜5|
|notes|text||
|image_url|text|任意|
|created_at|timestamp||
|updated_at|timestamp||

Index:
- UNIQUE(public_id)
- INDEX(user_id)

## 5. 画面要件（MVP）

### 5.1 ログ詳細ページ `/log/{public_id}`
表示：
- ユーザー表示名（リンク：`/u/{handle}`）
- 豆名、ロースター、産地、焙煎度
- 抽出方法、評価、日付、メモ
- 画像（任意）
- 共有ボタン（URLコピー）
- OGP確実（SSR/SSG）

### 5.2 プロフィール `/u/{handle}`
表示：
- アイコン、表示名、bio
- ログ一覧（新しい順）
- 各ログ：豆名、ロースター、評価、日付、詳細リンク

### 5.3 管理（ログインユーザー）
- ログ一覧
- ログ追加
- ログ編集（本人のみ）
- ログ削除（本人のみ）

## 6. OGP要件（必須）
`/log/{public_id}` で以下metaをSSRで返す：
- `og:title`
- `og:description`
- `og:image`
- `og:type`
- `og:url`
- `twitter:card=summary_large_image`

### og:title 例
- `Ethiopia Yirgacheffe / Onibus Coffee（★5）`

### og:description 例
- `浅煎り / V60 / フローラルで甘みが強い`

### og:image
- `image_url` があればそれを使用
- なければ自動生成画像URLを使用（例：`/api/og/log/{public_id}`）

## 7. 認証要件
- サインアップ
- ログイン
- ログアウト

権限：
- ログ作成：ログイン必須
- 編集/削除：本人のみ
- 閲覧：誰でも可

## 8. セキュリティ要件（RLS）
coffee_logs：
- SELECT：全許可
- INSERT：`auth.uid() = user_id`
- UPDATE：`auth.uid() = user_id`
- DELETE：`auth.uid() = user_id`

## 9. 技術要件（確定）
- フロント：Next.js（App Router）
  - 理由：SSR対応（OGP必須）、動的meta生成が容易
- バックエンド：Supabase
  - Auth / Postgres / Storage（画像）

## 10. 非機能要件
- レスポンシブ（スマホ優先）
- OGP確実表示
- 10000ログでも高速表示可能
- HTTPS必須