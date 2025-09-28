export type UserStatus = "ACTIVE" | "INACTIVE"| "BANNED" 

export type UserRow = {
  user_id: string 
  phone_number: string 
  email: string 
  first_name: string 
  last_name: string 
  full_name: string 
  profile_picture_url?: string 
  status: UserStatus 
  location_latitude: string 
  location_longitude: string 
  notification_enabled: boolean  // true=yes, false=no
  updated_at: string  // ISO
  created_at: string  // ISO
  deleted: boolean  // true=yes, false=no
} 
