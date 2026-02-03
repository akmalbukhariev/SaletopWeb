export type AnnouncementRow = {
    announcement_id: number;
    image_url: string;
    title: string;
    body: string;
    preview: string;
    scope: string;
    is_active: boolean;
    created_at_utc: number;
}