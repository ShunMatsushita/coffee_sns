'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [authUser, setAuthUser] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: au } } = await supabase.auth.getUser();
            if (au) {
                setAuthUser(true);
                const { data } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', au.id)
                    .single();
                if (data) setUser(data);
            }
        };
        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <header className="header">
            <div className="header-inner">
                <Link href={authUser ? '/dashboard' : '/'} className="logo">
                    <span className="logo-icon">☕</span>
                    <span className="logo-text">BeanLog</span>
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="メニューを開く"
                >
                    <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
                </button>

                <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
                    {authUser ? (
                        <>
                            <Link href="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                                ダッシュボード
                            </Link>
                            <Link href="/dashboard/new" className="nav-link nav-link-accent" onClick={() => setMenuOpen(false)}>
                                + ログ追加
                            </Link>
                            {user && (
                                <Link href={`/u/${user.handle}`} className="nav-link" onClick={() => setMenuOpen(false)}>
                                    @{user.handle}
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-ghost">
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                                ログイン
                            </Link>
                            <Link href="/signup" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                                新規登録
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
