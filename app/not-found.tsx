import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">☕</div>
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">ページが見つかりません</h2>
                <p className="not-found-description">
                    お探しのページは存在しないか、削除された可能性があります。
                </p>
                <div className="not-found-actions">
                    <Link href="/" className="btn btn-primary">
                        トップに戻る
                    </Link>
                    <Link href="/dashboard" className="btn btn-ghost">
                        ダッシュボード
                    </Link>
                </div>
            </div>
        </div>
    );
}
