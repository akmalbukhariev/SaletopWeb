export type NotificationRow = {
    id: number 
    phone_number : string
    message: string 
    sends: number 
    status: string 
    company: boolean // true bo'lsa company, false bo'lsa users - foydalanuvchi
    delivery_date: string 
} 