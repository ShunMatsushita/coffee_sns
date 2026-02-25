export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-cup">
                    <div className="loading-steam"></div>
                    <div className="loading-steam loading-steam-2"></div>
                    <div className="loading-steam loading-steam-3"></div>
                    <span className="loading-cup-icon">☕</span>
                </div>
                <p className="loading-text">読み込み中...</p>
            </div>
        </div>
    );
}
