'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
    ROAST_LEVEL_LABELS,
    BREW_METHOD_LABELS,
    type CoffeeLog,
    type RoastLevel,
    type BrewMethod,
} from '@/lib/types';
import { nanoid } from 'nanoid';

interface LogFormProps {
    initialData?: CoffeeLog;
    mode: 'create' | 'edit';
}

export default function LogForm({ initialData, mode }: LogFormProps) {
    const [formData, setFormData] = useState({
        bean_name: initialData?.bean_name ?? '',
        roaster_name: initialData?.roaster_name ?? '',
        origin_text: initialData?.origin_text ?? '',
        roast_level: initialData?.roast_level ?? 'medium' as RoastLevel,
        brew_method: initialData?.brew_method ?? 'pour_over' as BrewMethod,
        rating: initialData?.rating ?? 3,
        notes: initialData?.notes ?? '',
        consumed_at: initialData?.consumed_at
            ? new Date(initialData.consumed_at).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        image_url: initialData?.image_url ?? '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rating: number) => {
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('ログインが必要です');
                return;
            }

            const payload = {
                ...formData,
                consumed_at: new Date(formData.consumed_at).toISOString(),
                rating: Number(formData.rating),
                image_url: formData.image_url || null,
            };

            if (mode === 'create') {
                const { error: insertError } = await supabase.from('coffee_logs').insert({
                    ...payload,
                    public_id: nanoid(12),
                    user_id: user.id,
                });
                if (insertError) {
                    setError(insertError.message);
                    return;
                }
            } else if (initialData) {
                const { error: updateError } = await supabase
                    .from('coffee_logs')
                    .update(payload)
                    .eq('id', initialData.id);
                if (updateError) {
                    setError(updateError.message);
                    return;
                }
            }

            router.push('/dashboard');
            router.refresh();
        } catch {
            setError('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="log-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="bean_name">豆名 *</label>
                    <input
                        id="bean_name"
                        name="bean_name"
                        type="text"
                        value={formData.bean_name}
                        onChange={handleChange}
                        required
                        placeholder="Ethiopia Yirgacheffe"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="roaster_name">ロースター</label>
                    <input
                        id="roaster_name"
                        name="roaster_name"
                        type="text"
                        value={formData.roaster_name}
                        onChange={handleChange}
                        placeholder="Onibus Coffee"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="origin_text">産地</label>
                    <input
                        id="origin_text"
                        name="origin_text"
                        type="text"
                        value={formData.origin_text}
                        onChange={handleChange}
                        placeholder="エチオピア イルガチェフェ"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="consumed_at">飲んだ日</label>
                    <input
                        id="consumed_at"
                        name="consumed_at"
                        type="date"
                        value={formData.consumed_at}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="roast_level">焙煎度</label>
                    <select
                        id="roast_level"
                        name="roast_level"
                        value={formData.roast_level}
                        onChange={handleChange}
                    >
                        {Object.entries(ROAST_LEVEL_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="brew_method">抽出方法</label>
                    <select
                        id="brew_method"
                        name="brew_method"
                        value={formData.brew_method}
                        onChange={handleChange}
                    >
                        {Object.entries(BREW_METHOD_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>評価</label>
                <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`rating-btn ${star <= formData.rating ? 'active' : ''}`}
                            onClick={() => handleRatingChange(star)}
                        >
                            ★
                        </button>
                    ))}
                    <span className="rating-value">{formData.rating}/5</span>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">メモ</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="フローラルで甘みが強い..."
                />
            </div>

            <div className="form-group">
                <label htmlFor="image_url">画像URL（任意）</label>
                <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading
                        ? '保存中...'
                        : mode === 'create'
                            ? 'ログを追加'
                            : 'ログを更新'}
                </button>
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => router.back()}
                >
                    キャンセル
                </button>
            </div>
        </form>
    );
}
