import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import {
    ROAST_LEVEL_LABELS,
    BREW_METHOD_LABELS,
    type CoffeeLogWithUser,
} from '@/lib/types';
import RatingStars from '@/components/RatingStars';
import ShareButton from '@/components/ShareButton';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ public_id: string }>;
}

async function getLog(publicId: string): Promise<CoffeeLogWithUser | null> {
    const supabase = await createClient();
    const { data } = await supabase
        .from('coffee_logs')
        .select('*, users(*)')
        .eq('public_id', publicId)
        .single();
    return data as CoffeeLogWithUser | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { public_id } = await params;
    const log = await getLog(public_id);

    if (!log) {
        return { title: 'ログが見つかりません - BeanLog' };
    }

    const title = `${log.bean_name}${log.roaster_name ? ` / ${log.roaster_name}` : ''}（${'★'.repeat(log.rating)}）`;
    const description = [
        ROAST_LEVEL_LABELS[log.roast_level],
        BREW_METHOD_LABELS[log.brew_method],
        log.notes?.slice(0, 80),
    ]
        .filter(Boolean)
        .join(' / ');

    const ogImage = log.image_url || `/api/og/log/${log.public_id}`;

    return {
        title: `${title} - BeanLog`,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/log/${log.public_id}`,
            images: [{ url: ogImage, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function LogDetailPage({ params }: Props) {
    const { public_id } = await params;
    const log = await getLog(public_id);

    if (!log) notFound();

    const user = log.users;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return (
        <div className="container">
            <article className="log-detail">
                {log.image_url && (
                    <div className="log-detail-image">
                        <img src={log.image_url} alt={log.bean_name} />
                    </div>
                )}

                <div className="log-detail-content">
                    <div className="log-detail-header">
                        <h1>{log.bean_name}</h1>
                        <RatingStars rating={log.rating} size="lg" />
                    </div>

                    {log.roaster_name && (
                        <p className="log-detail-roaster">{log.roaster_name}</p>
                    )}

                    <div className="log-detail-meta">
                        <Link href={`/u/${user.handle}`} className="log-detail-author">
                            {user.avatar_url && (
                                <img
                                    src={user.avatar_url}
                                    alt={user.display_name}
                                    className="avatar-sm"
                                />
                            )}
                            <span>{user.display_name}</span>
                            <span className="handle">@{user.handle}</span>
                        </Link>
                        <time>
                            {new Date(log.consumed_at).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    </div>

                    <div className="log-detail-info">
                        <div className="info-grid">
                            {log.origin_text && (
                                <div className="info-item">
                                    <span className="info-label">産地</span>
                                    <span className="info-value">{log.origin_text}</span>
                                </div>
                            )}
                            <div className="info-item">
                                <span className="info-label">焙煎度</span>
                                <span className="info-value">
                                    {ROAST_LEVEL_LABELS[log.roast_level]}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">抽出方法</span>
                                <span className="info-value">
                                    {BREW_METHOD_LABELS[log.brew_method]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {log.notes && (
                        <div className="log-detail-notes">
                            <h2>メモ</h2>
                            <p>{log.notes}</p>
                        </div>
                    )}

                    <div className="log-detail-actions">
                        <ShareButton
                            url={`${siteUrl}/log/${log.public_id}`}
                            title={`${log.bean_name} - BeanLog`}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
}
