import { Label, Tune } from "@mui/icons-material"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextareaAutosize, TextField, Typography } from "@mui/material"
import React, { useState } from "react"
import { useSearchParams } from "react-router"
import toastNotify from "@/shared/components/toastNotify"
import { useSendNotificationToAllMutation, useSendNotificationToUserMutation } from "../api/notifyAPI"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { useAppNavigation } from "@/shared/hooks/useAppNavigation"
import { useTranslation } from "react-i18next"

function NotificationSend() {

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")

  const [searchParams] = useSearchParams()
  const searchCompany = searchParams.get('company') ?? false
  const sendUserOrCompany = searchCompany === 'yes' ? true : false
  const phone_number = searchParams.get('phone_number') ?? null

  //Translation
  const { t } = useTranslation(["headers", "buttons", "texts", "placeholders"])

  const [sendNotificationToUser] = useSendNotificationToUserMutation()
  const [sendNotificationToAll] = useSendNotificationToAllMutation()

  const nav = useAppNavigation()

  const handleSendNotification = (): void => {

    if(!title.trim() || !message.trim())
    {
      toastNotify(
        "Iltimos, ma'lumotlarni to'ldiring",
        "error",
      )
      return
    }

    if(phone_number)
    {
      sendNotificationToUser({ phone_number, title, message, company: sendUserOrCompany }).then((res) => {
        if (res.data?.resultCode == RESULTCODE.SUCCESS) {
          toastNotify(
            res.data?.resultMsg,
            "success",
          ) 

          // Move to notification page
          nav.toNotificationsHome()
        } else {
          toastNotify(
            res.data?.resultMsg,
            "error",
          ) 
        }
      })
    }else {
      sendNotificationToAll({ title, message }).then((res) => {
        if (res.data?.resultCode == RESULTCODE.SUCCESS) {
          toastNotify(
            res.data?.resultMsg,
            "success",
          ) 

          // Move to notification page
          nav.toNotificationsHome()
        } else {
          toastNotify(
            res.data?.resultMsg,
            "error",
          ) 
        }
      })
    }
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
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("Notifications", { ns: "sidebar" })}</Typography>
      <Typography sx={{ fontSize: 16, color: "text.secondary" }}>{t("NotificationDesc", { ns: "texts" })}</Typography>
    </Stack>
    <FormControl sx={{ flexGrow: 1, overflow: "auto", p: 2, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Title field */}
      <TextField required id="title" label="Title" sx={{ width: { xs: "100%", sm: "50%", lg: "30%" } }} value={title} onChange={(e) => setTitle(e.target.value)}/>

      {/* Message field */}
      <TextareaAutosize 
        required
        style={{ width: '50%', fontSize: 16 }}
        id="message" 
        minRows={6}
        maxRows={8}
        placeholder= {t("NotificationsTextArea", { ns: "placeholders" })}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    
      {/* Sending type field */}
      {
        phone_number && <>
          <TextField id="phone_number" disabled type="number" label={t("Phone", { ns: "headers" })} sx={{ width: { xs: "100%", sm: "100%", lg: "50%" } }} value={phone_number}/>
        </>
      }
      <Box sx={{ display: "flex", width: { xs: "100%", sm: "100%", lg: "50%" }, justifyContent: "flex-end", gap: 2 }}>
        <Button variant="contained" fullWidth onClick={() => handleSendNotification()}>
          {t("Send", { ns: "buttons" })}
        </Button>
      </Box>
    </FormControl>

  </Grid>
}

export default NotificationSend
