'use client';

import LogForm from '@/components/LogForm';

export default function NewLogPage() {
    return (
        <div className="container">
            <div className="page-header">
                <h1>新しいログ</h1>
                <p>飲んだコーヒーを記録しましょう</p>
            </div>
            <LogForm mode="create" />
        </div>
    );
}
