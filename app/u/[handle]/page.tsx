import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { User, CoffeeLog } from '@/lib/types';
import LogCard from '@/components/LogCard';
import type { Metadata } from 'next';

const LOGS_PER_PAGE = 20;

interface Props {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ page?: string }>;
}

async function getUserByHandle(
    handle: string,
    page: number
): Promise<{ user: User; logs: CoffeeLog[]; totalCount: number } | null> {
    const supabase = await createClient();

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('handle', handle)
        .single();

    if (!user) return null;

    const from = page * LOGS_PER_PAGE;
    const to = from + LOGS_PER_PAGE - 1;

    const { data: logs, count } = await supabase
        .from('coffee_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('consumed_at', { ascending: false })
        .range(from, to);

    return { user, logs: logs || [], totalCount: count ?? 0 };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const data = await getUserByHandle(handle, 0);

    if (!data) {
        return { title: 'ユーザーが見つかりません - BeanLog' };
    }

    return {
        title: `${data.user.display_name} (@${data.user.handle}) - BeanLog`,
        description: data.user.bio || `${data.user.display_name}のコーヒーログ`,
        openGraph: {
            title: `${data.user.display_name} (@${data.user.handle})`,
            description: data.user.bio || `${data.user.display_name}のコーヒーログ`,
            type: 'profile',
        },
    };
}

export default async function ProfilePage({ params, searchParams }: Props) {
    const { handle } = await params;
    const sp = await searchParams;
    const page = Math.max(0, parseInt(sp.page || '0', 10));
    const data = await getUserByHandle(handle, page);

    if (!data) notFound();

    const { user, logs, totalCount } = data;
    const totalPages = Math.ceil(totalCount / LOGS_PER_PAGE);

    return (
        <div className="container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.display_name} />
                    ) : (
                        <div className="avatar-placeholder">
                            {user.display_name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="profile-info">
                    <h1>{user.display_name}</h1>
                    <p className="profile-handle">@{user.handle}</p>
                    {user.bio && <p className="profile-bio">{user.bio}</p>}
                    <p className="profile-stats">
                        <span className="stat">{totalCount} ログ</span>
                    </p>
                </div>
            </div>

            <div className="profile-logs">
                <h2>コーヒーログ</h2>
                {logs.length === 0 ? (
                    <p className="empty-text">まだログがありません</p>
                ) : (
                    <>
                        <div className="log-grid">
                            {logs.map((log) => (
                                <LogCard key={log.id} log={log} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                {page > 0 ? (
                                    <a
                                        href={`/u/${handle}?page=${page - 1}`}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        ← 前へ
                                    </a>
                                ) : (
                                    <span className="btn btn-ghost btn-sm" style={{ opacity: 0.3 }}>
                                        ← 前へ
                                    </span>
                                )}
                                <div className="pagination-info">
                                    {page + 1} / {totalPages}
                                </div>
                                {page < totalPages - 1 ? (
                                    <a
                                        href={`/u/${handle}?page=${page + 1}`}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        次へ →
                                    </a>
                                ) : (
                                    <span className="btn btn-ghost btn-sm" style={{ opacity: 0.3 }}>
                                        次へ →
                                    </span>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
