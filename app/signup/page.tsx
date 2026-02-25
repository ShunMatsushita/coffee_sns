'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HANDLE_REGEX } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [handle, setHandle] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!HANDLE_REGEX.test(handle)) {
            setError('ハンドルは英小文字で始まり、英小文字・数字・アンダースコアで3〜20文字です');
            return;
        }

        setLoading(true);

        try {
            // Supabase Auth サインアップ
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            if (!authData.user) {
                setError('サインアップに失敗しました');
                return;
            }

            // users テーブルにプロフィールを作成
            const { error: profileError } = await supabase.from('users').insert({
                id: authData.user.id,
                handle,
                display_name: displayName,
            });

            if (profileError) {
                setError(profileError.message);
                return;
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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>アカウント作成</h1>
                    <p>コーヒーログを記録・共有しよう</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">メールアドレス</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="coffee@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">パスワード</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            placeholder="6文字以上"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="handle">ハンドル名</label>
                        <div className="input-prefix-wrapper">
                            <span className="input-prefix">@</span>
                            <input
                                id="handle"
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.toLowerCase())}
                                required
                                placeholder="coffee_lover"
                                pattern="^[a-z][a-z0-9_]{2,19}$"
                            />
                        </div>
                        <small>英小文字で始まり、英小文字・数字・_で3〜20文字</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="displayName">表示名</label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            placeholder="コーヒー太郎"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? '処理中...' : 'アカウント作成'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        すでにアカウントをお持ちですか？{' '}
                        <Link href="/login">ログイン</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
