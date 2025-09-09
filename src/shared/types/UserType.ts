
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export type UserRow = {
  id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture_url?: string;
  status: UserStatus;
  notification_enabled: 0 | 1; // 1=yes, 0=no
  updated_at: string; // ISO
  created_at: string; // ISO
  deleted: 0 | 1; // 1=yes, 0=no
};