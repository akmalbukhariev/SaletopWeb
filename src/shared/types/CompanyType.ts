export type CompanyStatus = "ACTIVE" | "INACTIVE";

export type Company = {
  company_id: string; // using string for DataGrid id compatibility
  company_name: string;
  phone_number?: string | null;
  email?: string | null;
  logo_url?: string | null;
  business_type:
    | "RESTAURANT"
    | "BAKERY"
    | "CAFE"
    | "FAST_FOOD"
    | "SUPERMARKET"
    | "OTHER";
  user_need_to_know: string; // text
  rating: number; // decimal(3,2)
  location_latitude?: number | null;
  location_longitude?: number | null;
  working_hours?: string | null;
  telegram_link?: string | null;
  social_profile_link?: string | null;
  password_hash?: string | null;
  token_mb?: string | null;
  token_frb?: string | null;
  status: CompanyStatus;
  notification_enabled: 0 | 1; // 1=yes, 0=no
  about?: string | null;
  updated_at?: string | null; // ISO
  created_at?: string | null; // ISO
  deleted: 0 | 1; // 1=yes, 0=no
};
