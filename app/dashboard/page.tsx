'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CoffeeLog } from '@/lib/types';
import LogCard from '@/components/LogCard';
import Link from 'next/link';

export default function DashboardPage() {
    const [logs, setLogs] = useState<CoffeeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchLogs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('coffee_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('consumed_at', { ascending: false });

        if (data) setLogs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('このログを削除しますか？')) return;

        const { error } = await supabase.from('coffee_logs').delete().eq('id', id);
        if (!error) {
            setLogs((prev) => prev.filter((log) => log.id !== id));
        }
    };

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
                <h1>ダッシュボード</h1>
                <Link href="/dashboard/new" className="btn btn-primary">
                    + 新しいログ
                </Link>
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
            )}
        </div>
    );
}
