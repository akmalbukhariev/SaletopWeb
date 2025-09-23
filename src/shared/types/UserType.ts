export type UserStatus = "ACTIVE" | "INACTIVE";

export type UserRow = {
  user_id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture_url?: string;
  status: UserStatus;
  location_latitude: string;
  location_longitude: string;
  notification_enabled: 0 | 1; // 1=yes, 0=no
  updated_at: string; // ISO
  created_at: string; // ISO
  deleted: 0 | 1; // 1=yes, 0=no
};
