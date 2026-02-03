import toastNotify from "@/shared/components/toastNotify"
import { useAppNavigation } from "@/shared/hooks/useAppNavigation"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { Box, Button, FormControl, Grid, Stack, TextareaAutosize, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { useLocation } from "react-router"
import { useCreateAnnouncementMutation } from "./api/announcementAPI"
import { useTranslation } from "react-i18next"
import { RegisterAnnouncementType } from "./types/RequestTypes"

function CreateAnnouncementPage() {

  const location = useLocation()
  
  const locationState = location.state as RegisterAnnouncementType | undefined

  const navigation = useAppNavigation()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const scope = useRef<"BROADCAST" | "TARGETED">(
    locationState?.scope === "TARGETED" ? "TARGETED" : "BROADCAST"
  )

  const targets = useRef(locationState?.targets || [])
  
  //Translation
  const { t } = useTranslation(["headers", "buttons", "texts", "placeholders"])

  const [ createAnnouncement ] = useCreateAnnouncementMutation()

  const handleSendCreateAnnouncement = (): void => {

    if(!title.trim() || !body.trim())
    {
      toastNotify(
        t("PleaseFillInTheInformation", { ns: "texts" }),
        "error",
      )
      return
    }

    // Prepare data
    const data: RegisterAnnouncementType = {
      title: title,
      body: body,
      preview: "",
      imageUrl: "",
      scope: scope.current,
      isActive: true,
      targets: targets.current,
      announcement_Id: 0
    }     
    
    // Call API
    setIsLoading(true)
    createAnnouncement(data)
      .then((res: any) => {
        if(res?.data?.resultCode == RESULTCODE.SUCCESS) {
          toastNotify(
            t("AnnouncementCreatedSuccessfully", { ns: "texts" }),
            "success",
          )
          setTitle("")
          setBody("")
        
          navigation.toAnnouncementsHome()
        } else {
          toastNotify(
            t("ErrorCreatingAnnouncement", { ns: "texts" }),
            "error",
          )
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }


  return <Grid
    sx={{
      borderRadius: 4,
      boxShadow: 2,
      height: "100%",
      width: "100%",
      p: 2,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    <Stack
      direction='column'
      alignItems='flex-start'
      justifyContent='flex-start'
      sx={{ mb: 2, flexShrink: 0 }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("RegisterAnnouncement", { ns: "texts" })}<span>{} ({scope.current})</span> </Typography>
      <Typography sx={{ fontSize: 16, color: "text.secondary" }}>{t("AnnouncementsDesc", { ns: "texts" })}</Typography>
    </Stack>
    <FormControl sx={{ flexGrow: 1, overflow: "auto", p: 2, display: "flex", flexDirection: "column", gap: 4 }}>
     
      {/* Title field */}
      <TextField required id="title" label={t("Title", { ns: "headers" })} sx={{ width: { xs: "100%", sm: "50%", lg: "30%" } }} value={title} onChange={(e) => setTitle(e.target.value)}/>

      {/* Message field */}
      <TextareaAutosize 
        required
        style={{ width: '50%', fontSize: 16, padding: 8, borderRadius: 4, borderColor: '#c4c4c4', fontFamily: 'Roboto, sans-serif' }}
        id="message" 
        minRows={6}
        maxRows={8}
        placeholder= {t("AnnouncementTextArea", { ns: "placeholders" })}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
    
      {/* Sending type field */}
      {
        // <>
        //   <TextField id="phone_number" disabled type="number" label={t("Phone", { ns: "headers" })} sx={{ width: { xs: "100%", sm: "100%", lg: "50%" } }} value={phone_number}/>
        // </>
      }
      <Box sx={{ display: "flex", width: { xs: "100%", sm: "100%", lg: "50%" }, justifyContent: "flex-end", gap: 2 }}>
        <Button variant="contained" fullWidth onClick={() => handleSendCreateAnnouncement()} disabled={isLoading}>
          {t("Register", { ns: "buttons" })}
        </Button>
      </Box>
    </FormControl>

  </Grid>
}

export default CreateAnnouncementPage