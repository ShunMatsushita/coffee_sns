'use client';

import { useState } from 'react';

interface ShareButtonProps {
    url: string;
    title: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // ユーザーがキャンセルした場合
            }
        } else {
            handleCopy();
        }
    };

    return (
        <button onClick={handleShare} className="btn btn-share" title="共有">
            {copied ? (
                <>✓ コピーしました</>
            ) : (
                <>🔗 共有</>
            )}
        </button>
    );
}
