'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CoffeeLog } from '@/lib/types';
import LogCard from '@/components/LogCard';
import Link from 'next/link';

const LOGS_PER_PAGE = 12;

export default function DashboardPage() {
    const [logs, setLogs] = useState<CoffeeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const supabase = createClient();

    const fetchLogs = async (pageNum: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const from = pageNum * LOGS_PER_PAGE;
        const to = from + LOGS_PER_PAGE - 1;

        const { data, count } = await supabase
            .from('coffee_logs')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .order('consumed_at', { ascending: false })
            .range(from, to);

        if (data) {
            setLogs(data);
            setTotalCount(count ?? 0);
            setHasMore((count ?? 0) > (pageNum + 1) * LOGS_PER_PAGE);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!confirm('このログを削除しますか？')) return;

        const { error } = await supabase.from('coffee_logs').delete().eq('id', id);
        if (!error) {
            setLogs((prev) => prev.filter((log) => log.id !== id));
            setTotalCount((prev) => prev - 1);
        }
    };

    const totalPages = Math.ceil(totalCount / LOGS_PER_PAGE);

    if (loading) {
        return (
            <div className="container">
                <div className="loading-spinner">読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="dashboard-header">
                <div>
                    <h1>ダッシュボード</h1>
                    {totalCount > 0 && (
                        <p className="dashboard-count">{totalCount} 件のログ</p>
                    )}
                </div>
                <div className="dashboard-actions">
                    <Link href="/dashboard/settings" className="btn btn-ghost btn-sm">
                        ⚙ 設定
                    </Link>
                    <Link href="/dashboard/new" className="btn btn-primary">
                        + 新しいログ
                    </Link>
                </div>
            </div>

            {logs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">☕</div>
                    <h2>まだログがありません</h2>
                    <p>最初のコーヒーログを記録しましょう！</p>
                    <Link href="/dashboard/new" className="btn btn-primary">
                        ログを追加する
                    </Link>
                </div>
            ) : (
                <>
                    <div className="log-grid">
                        {logs.map((log) => (
                            <LogCard
                                key={log.id}
                                log={log}
                                showActions
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                ← 前へ
                            </button>
                            <div className="pagination-info">
                                {page + 1} / {totalPages}
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!hasMore}
                            >
                                次へ →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
