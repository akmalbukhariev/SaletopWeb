export type CompanyStatus = "ACTIVE" |  "INACTIVE" | "BANNED";

export type Company = {
  company_id: string; // using string for DataGrid id compatibility
  company_name: string;
  phone_number: string;
  email?: string | null;
  logo_url?: string | null;
  business_type: string | null; // enum
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
  notification_enabled: boolean; // 1=yes, 0=no
  about?: string | null;
  updated_at?: string | null; // ISO
  created_at?: string | null; // ISO
  deleted: boolean; // 1=yes, 0=no
};
