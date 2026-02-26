/**
 * L0: Definitions - The Source of Truth
 */

export interface MediaAsset {
    url: string;
    alt: string;
    type: 'image' | 'video';
    poster?: string; // For videos
}

export interface PageHero {
    title: string;
    subtitle: string;
    media?: MediaAsset;
    emphasis_point: string; // 每个页面独特的侧重点信号
}

export interface Story {
    slug: string;
    title: string;
    date: string;
    author: string;
    summary: string;
    content: string; // Markdown or HTML
    cover: MediaAsset;
    tags: string[];
    featured: boolean;
}

export interface SEOConfig {
    site_url: string;
    keywords: string[];
    robots_instructions: string;
    schema: {
        cuisine: string;
        price_range: string;
        has_menu_url: string;
        accepts_reservations: boolean;
    };
}

export interface BookingConfig {
    title: string;
    emphasis: string;
    method: 'whatsapp' | 'email' | 'system';
    contact_value: string;
    terms: string[];
    capacity: {
        max_per_hour: number;
        interval_minutes: number;
    };
}

export interface ChatbotConfig {
    api_endpoint: string;
    system_prompt: string;
    welcome_message: string;
    manual_review_threshold: number;
}

export interface BookingRecord {
    id: string;
    source: 'web' | 'chatbot' | 'manual';
    name: string;
    email: string;
    mobile: string;
    date: string;
    time: string;
    group_size: number;
    status: 'Confirmed' | 'Manual_Review' | 'Cancelled';
    created_at: string;
}

export interface AdminConfig {
    dashboard_title: string;
    auth_key_required: boolean;
    view_modes: ['list', 'calendar'];
}

export interface SiteIdentity {
    name: string;
    legal_name: string;
    core_purpose: string; // 统一维护的主旨
    price_range: string;
    currency: string;
    average_spend_aud: string;
    description: string;
    founding_date: string;
    seo: SEOConfig;
    booking: BookingConfig;
    chatbot: ChatbotConfig;
    admin: AdminConfig;
}


