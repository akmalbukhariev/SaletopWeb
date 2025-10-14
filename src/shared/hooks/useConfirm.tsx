import { Close } from "@mui/icons-material"
import { Box, Button, IconButton, Modal, Typography } from "@mui/material"
import React from "react"
import { useTranslation } from "react-i18next"

let confirmResolve: ((value: boolean) => void ) | null = null

export function useConfirm() {
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState < "delete" | 'confirm' > ("delete")

  const { t } = useTranslation(["texts"])

  const confirm = (title: string, msg: string, type: "delete" | 'confirm') => {
    setMessage(msg)
    setOpen(true)
    setTitle(title)
    setType(type)
    return new Promise<boolean>((resolve) => {
      confirmResolve = resolve
    })
  }

  const handleClose = (result: boolean) => {
    setOpen(false)
    if (confirmResolve) {
      confirmResolve(result)
      confirmResolve = null
    }
  }

  const ConfirmDialog = (
    <Modal open={open} onClose={() => handleClose(false)} sx={{ zIndex: 9999, borderRadius: "8px" }}>
      <Box sx={{ p: 3, bgcolor: "white", maxWidth: 400, mx: "auto", mt: "20%", borderRadius: "8px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
          <Typography variant="h6" fontWeight={"bold"}> {title}</Typography>
          <IconButton onClick={() => handleClose(false)}>
            <Close />
          </IconButton>
        </Box>
        <Typography sx={{ my: 2, }}>{message}</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={() => handleClose(false)}>{t("Cancel", { ns: "texts" })}</Button>
          <Button onClick={() => handleClose(true)} color= {type === "delete" ? "error" : "primary"} variant="contained" sx={{ ml: 1 }}>
            {t("Confirm", { ns: "texts" })}
          </Button>
        </Box>
      </Box>
    </Modal>
  )


  return { confirm, ConfirmDialog }
}
