import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';
import { ROAST_LEVEL_LABELS, BREW_METHOD_LABELS } from '@/lib/types';

export const runtime = 'edge';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ public_id: string }> }
) {
    const { public_id } = await params;

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: log } = await supabase
            .from('coffee_logs')
            .select('*, users(*)')
            .eq('public_id', public_id)
            .single();

        if (!log) {
            return new Response('Not found', { status: 404 });
        }

        const stars = '★'.repeat(log.rating) + '☆'.repeat(5 - log.rating);

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '60px',
                        background: 'linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)',
                        color: '#f5e6d3',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '48px', marginRight: '16px' }}>☕</span>
                        <span style={{ fontSize: '24px', opacity: 0.7 }}>BeanLog</span>
                    </div>
                    <div style={{ fontSize: '56px', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.2 }}>
                        {log.bean_name}
                    </div>
                    {log.roaster_name && (
                        <div style={{ fontSize: '28px', opacity: 0.8, marginBottom: '16px' }}>
                            {log.roaster_name}
                        </div>
                    )}
                    <div style={{ fontSize: '40px', marginBottom: '24px', color: '#d4a574' }}>
                        {stars}
                    </div>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '22px', opacity: 0.7 }}>
                        <span>{ROAST_LEVEL_LABELS[log.roast_level as keyof typeof ROAST_LEVEL_LABELS]}</span>
                        <span>•</span>
                        <span>{BREW_METHOD_LABELS[log.brew_method as keyof typeof BREW_METHOD_LABELS]}</span>
                        {log.origin_text && (
                            <>
                                <span>•</span>
                                <span>{log.origin_text}</span>
                            </>
                        )}
                    </div>
                    <div style={{ position: 'absolute', bottom: '40px', right: '60px', fontSize: '18px', opacity: 0.5 }}>
                        by {log.users?.display_name || 'Anonymous'}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch {
        return new Response('Error generating image', { status: 500 });
    }
}
