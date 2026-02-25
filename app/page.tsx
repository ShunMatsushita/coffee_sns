import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">☕ コーヒーログプラットフォーム</div>
          <h1 className="hero-title">
            あなたのコーヒー体験を
            <br />
            <span className="gradient-text">記録・共有</span>
            しよう
          </h1>
          <p className="hero-description">
            飲んだコーヒー豆の記録を残し、公開URLで誰とでもシェア。
            あなたのコーヒーライフをもっと豊かに。
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary btn-lg">
              無料で始める
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">
              ログイン
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-card hero-card-1">
              <span className="hero-card-emoji">☕</span>
              <div>
                <strong>Ethiopia Yirgacheffe</strong>
                <p>Onibus Coffee</p>
                <span className="hero-card-stars">★★★★★</span>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <span className="hero-card-emoji">🫘</span>
              <div>
                <strong>Guatemala Antigua</strong>
                <p>Blue Bottle Coffee</p>
                <span className="hero-card-stars">★★★★☆</span>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <span className="hero-card-emoji">✨</span>
              <div>
                <strong>Kenya AA</strong>
                <p>Fuglen Coffee</p>
                <span className="hero-card-stars">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">特長</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>簡単記録</h3>
            <p>豆名、ロースター、焙煎度、抽出方法、評価まで、コーヒーの全てを記録できます。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>公開URL共有</h3>
            <p>各ログは固定URLで共有可能。SNSやブログに貼って、あなたのコーヒー体験をシェアしましょう。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🖼️</div>
            <h3>OGP対応</h3>
            <p>リンクを貼るだけで豆名・評価・ロースターが美しくプレビュー表示されます。</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>公開プロフィール</h3>
            <p>あなたのコーヒーログ一覧が公開プロフィールページで一覧できます。</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>さぁ、最初のログを記録しよう</h2>
        <p>無料でアカウントを作成して、コーヒーログを始めましょう。</p>
        <Link href="/signup" className="btn btn-primary btn-lg">
          アカウント作成
        </Link>
      </section>
    </div>
  );
}
