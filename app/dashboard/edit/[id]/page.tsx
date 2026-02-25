'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { CoffeeLog } from '@/lib/types';
import LogForm from '@/components/LogForm';

export default function EditLogPage() {
    const params = useParams();
    const router = useRouter();
    const [log, setLog] = useState<CoffeeLog | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchLog = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('coffee_logs')
                .select('*')
                .eq('id', params.id)
                .single();

            if (!data || data.user_id !== user.id) {
                router.push('/dashboard');
                return;
            }

            setLog(data);
            setLoading(false);
        };
        fetchLog();
    }, [params.id, router, supabase]);

    if (loading) {
        return (
            <div className="container">
                <div className="loading-spinner">読み込み中...</div>
            </div>
        );
    }

    if (!log) return null;

    return (
        <div className="container">
            <div className="page-header">
                <h1>ログ編集</h1>
                <p>{log.bean_name}</p>
            </div>
            <LogForm mode="edit" initialData={log} />
        </div>
    );
}
