export default function DashboardLoading() {
    return (
        <div className="container">
            <div className="dashboard-header">
                <div className="skeleton skeleton-title" style={{ width: '200px' }}></div>
                <div className="skeleton skeleton-btn"></div>
            </div>
            <div className="log-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="log-card skeleton-card">
                        <div className="log-card-body">
                            <div className="skeleton skeleton-line" style={{ width: '70%' }}></div>
                            <div className="skeleton skeleton-line" style={{ width: '50%' }}></div>
                            <div className="skeleton skeleton-line-sm" style={{ width: '90%' }}></div>
                            <div className="skeleton skeleton-line-sm" style={{ width: '40%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
