 type AnnouncementStateType = {
  scope: "BROADCAST" | "TARGETED"
  targets?: Array<{  
        targetId?: number
        targetType?: "USER" | "COMPANY"
    }>
}

 type GetAnnouncementType = {
    pageSize: number,
    offset: number,
    actorType: string,
    actorId: number
}

 type RegisterAnnouncementType = {
  title: string,
  preview: string,
  body: string,
  imageUrl: string,
  scope: string,
  isActive: boolean,
  targets: Array<{
        targetType: string,
        targetId: number
    }>,
  announcement_Id: number
} 

 type DeleteAnnouncementType = {
    id_list: number[]
}

/// RENAME 



export {
  AnnouncementStateType,
  GetAnnouncementType,
  RegisterAnnouncementType,
  DeleteAnnouncementType
}


