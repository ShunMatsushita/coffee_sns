import Link from 'next/link';
import { ROAST_LEVEL_LABELS, BREW_METHOD_LABELS } from '@/lib/types';
import type { CoffeeLog } from '@/lib/types';
import RatingStars from './RatingStars';

interface LogCardProps {
    log: CoffeeLog;
    showActions?: boolean;
    onDelete?: (id: string) => void;
}

export default function LogCard({ log, showActions, onDelete }: LogCardProps) {
    return (
        <div className="log-card">
            {log.image_url && (
                <div className="log-card-image">
                    <img src={log.image_url} alt={log.bean_name} />
                </div>
            )}
            <div className="log-card-body">
                <div className="log-card-header">
                    <h3 className="log-card-title">
                        <Link href={`/log/${log.public_id}`}>{log.bean_name}</Link>
                    </h3>
                    <RatingStars rating={log.rating} />
                </div>
                {log.roaster_name && (
                    <p className="log-card-roaster">{log.roaster_name}</p>
                )}
                <div className="log-card-tags">
                    {log.origin_text && <span className="tag">{log.origin_text}</span>}
                    <span className="tag">{ROAST_LEVEL_LABELS[log.roast_level]}</span>
                    <span className="tag">{BREW_METHOD_LABELS[log.brew_method]}</span>
                </div>
                <div className="log-card-meta">
                    <time>{new Date(log.consumed_at).toLocaleDateString('ja-JP')}</time>
                </div>
                {showActions && (
                    <div className="log-card-actions">
                        <Link href={`/dashboard/edit/${log.id}`} className="btn btn-sm btn-ghost">
                            編集
                        </Link>
                        <button
                            onClick={() => onDelete?.(log.id)}
                            className="btn btn-sm btn-danger"
                        >
                            削除
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
