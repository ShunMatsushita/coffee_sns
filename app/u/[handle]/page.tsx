import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { User, CoffeeLog } from '@/lib/types';
import LogCard from '@/components/LogCard';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ handle: string }>;
}

async function getUserByHandle(
    handle: string
): Promise<{ user: User; logs: CoffeeLog[] } | null> {
    const supabase = await createClient();

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('handle', handle)
        .single();

    if (!user) return null;

    const { data: logs } = await supabase
        .from('coffee_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('consumed_at', { ascending: false });

    return { user, logs: logs || [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle } = await params;
    const data = await getUserByHandle(handle);

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

export default async function ProfilePage({ params }: Props) {
    const { handle } = await params;
    const data = await getUserByHandle(handle);

    if (!data) notFound();

    const { user, logs } = data;

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
                        <span className="stat">{logs.length} ログ</span>
                    </p>
                </div>
            </div>

            <div className="profile-logs">
                <h2>コーヒーログ</h2>
                {logs.length === 0 ? (
                    <p className="empty-text">まだログがありません</p>
                ) : (
                    <div className="log-grid">
                        {logs.map((log) => (
                            <LogCard key={log.id} log={log} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
