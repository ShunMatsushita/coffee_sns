'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { HANDLE_REGEX } from '@/lib/types';

export default function SettingsPage() {
    const [profile, setProfile] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setDisplayName(data.display_name);
                setBio(data.bio || '');
                setAvatarUrl(data.avatar_url || '');
            }
        };
        fetchProfile();
    }, [supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    display_name: displayName,
                    bio: bio || null,
                    avatar_url: avatarUrl || null,
                })
                .eq('id', profile?.id);

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess('プロフィールを更新しました');
            router.refresh();
        } catch {
            setError('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    if (!profile) {
        return (
            <div className="container">
                <div className="loading-spinner">読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>プロフィール設定</h1>
                <p>@{profile.handle}</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="form-group">
                    <label htmlFor="displayName">表示名</label>
                    <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="bio">自己紹介</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="コーヒー好きです！"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="avatarUrl">アイコンURL</label>
                    <input
                        id="avatarUrl"
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                    />
                    {avatarUrl && (
                        <div className="avatar-preview">
                            <img src={avatarUrl} alt="プレビュー" />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? '保存中...' : 'プロフィールを更新'}
                </button>
            </form>
        </div>
    );
}
