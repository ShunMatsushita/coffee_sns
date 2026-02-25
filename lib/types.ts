export type RoastLevel =
    | 'light'
    | 'medium_light'
    | 'medium'
    | 'medium_dark'
    | 'dark';

export type BrewMethod =
    | 'drip'
    | 'pour_over'
    | 'french_press'
    | 'espresso'
    | 'aeropress'
    | 'cold_brew'
    | 'siphon'
    | 'moka_pot'
    | 'other';

export const ROAST_LEVEL_LABELS: Record<RoastLevel, string> = {
    light: 'ライトロースト',
    medium_light: 'ミディアムライト',
    medium: 'ミディアム',
    medium_dark: 'ミディアムダーク',
    dark: 'ダークロースト',
};

export const BREW_METHOD_LABELS: Record<BrewMethod, string> = {
    drip: 'ドリップ',
    pour_over: 'ハンドドリップ',
    french_press: 'フレンチプレス',
    espresso: 'エスプレッソ',
    aeropress: 'エアロプレス',
    cold_brew: 'コールドブリュー',
    siphon: 'サイフォン',
    moka_pot: 'マキネッタ',
    other: 'その他',
};

export interface User {
    id: string;
    handle: string;
    display_name: string;
    bio: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface CoffeeLog {
    id: string;
    public_id: string;
    user_id: string;
    consumed_at: string;
    bean_name: string;
    roaster_name: string;
    origin_text: string;
    roast_level: RoastLevel;
    brew_method: BrewMethod;
    rating: number;
    notes: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface CoffeeLogWithUser extends CoffeeLog {
    users: User;
}

export const HANDLE_REGEX = /^[a-z][a-z0-9_]{2,19}$/;
