import { Avatar, Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Popover, Select, TextField, Typography } from "@mui/material" 
import SideBar from "./components/SideBar" 
import { Outlet } from "react-router" 
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useState, ChangeEvent, useEffect, MouseEvent } from "react"
import { useSideBarList } from "@/shared/constants/sideBarList"
import { useTranslation } from "react-i18next"
import { IUserState } from "@/shared/types/IUserState"
import PersonIcon from "@mui/icons-material/Person"
import { useAuth } from "@/pages/auth"
import { useConfirm } from '../../shared/hooks/useConfirm'


function MainLayout() {

  const sideBarList = useSideBarList()
  const [openPopover, setOpenPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const [language, setLanguage] = useState(localStorage.getItem("i18nextLng") || "uz")

  //Translation
  const { t, i18n } = useTranslation(["texts", "placeholders"])

  const { signOut } = useAuth()

  const { confirm, ConfirmDialog } = useConfirm()

  const userInfo: IUserState = useAppSelector(state => state.user) 

  useEffect(() => {
    setLanguage(localStorage.getItem("i18nextLng") || "uz")

  }, [language, userInfo])

  const handleLanguageChange = (language: string) => {
    setLanguage(language)
    i18n.changeLanguage(language)
  }

  const id = openPopover ? 'simple-popper' : undefined
  const handleOpenPopover = () => (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget) 
    setOpenPopover((prev) => !prev)
  
  }
  const handleActionClose = () => {
    setAnchorEl(null)
    setOpenPopover(false)
  }

  const handleLogout = async () => {
    if(await confirm(
      "Logout",
      t("Are you sure you want to logout?", { ns: "messages" }),
      'confirm'
    ))
    {
      handleActionClose()
      signOut()
    }else{
      handleActionClose()
    }
  }
  
  return (
    <>
      <Grid container sx={{ minWidth: "100vh", minHeight: "100vh" }}>
        {/* Left Area  */}
        <Grid size={2} sx={{ height: "100vh", borderRight: "1px solid #d9d9d9" }}>
          <Box
            sx={{
              p: 2,
              height: { sm: "70px", lg: "70px", xl: "80px" },
              borderBottom: "1px solid #d9d9d9",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              color: "green",
              fontWeight: "bold",
              fontSize: { sm: "16px", lg: "24px", xl: "26px" },
            }}
          >
            {/* Company Icon */}
            SaleTop Admin
          </Box>
          <Box sx={{ p: 2 }}>
            {/* <Sidebar /> */}
            <SideBar items={sideBarList} />
          </Box>
        </Grid>

        {/* Main Content Area */}
        <Grid
          size={10}
          sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #d9d9d9",
              height: { sm: "70px", lg: "70px", xl: "80px" },
              display: "flex",
              alignItems: "center",
              justifyContent: 'flex-end',
              p: 4,
            }}
          >
            {/* <TextField
              size="small"
              label={t("Search") + "..."}
              variant="outlined"
              value={search}
              sx={{ width: "50%" }}
              onChange={handleSearchChange}
            /> */}
            <Box
              sx={{
                ml: 2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10
              }}
            >
              <FormControl sx={{ width: 100 }} size="small">
                <InputLabel id="demo-simple-select-label" htmlFor="demo-simple-select-label" >{t("Language", { ns: "texts" })}</InputLabel>
                <Select value={language} defaultValue={"uz"} id="demo-simple-select-label" label={t("Language", { ns: "texts" })} onChange={(e) => handleLanguageChange(e.target.value)}>
                  <MenuItem value="en">EN</MenuItem>
                  <MenuItem value="uz">UZ</MenuItem>
                  <MenuItem value="uz-Cyrl">KIRIL</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                
                <IconButton onClick={handleOpenPopover()}>
                  <PersonIcon/>
                </IconButton>
                <Popover id={id} open={openPopover} anchorEl={anchorEl} sx={{ minWidth: 200, p:0, zIndex: 9999 }} anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }} onClose={handleActionClose}> 
                  <Box sx={{ width: 160, p:1, bgcolor: 'background.paper' }}>
                    <Button
                      sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                      fullWidth
                      variant="text"
                      color="error"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Box>
                </Popover>
                <Typography variant="body1">{userInfo.admin_id}</Typography>
              </Box>
             
            </Box>
          </Box>
          <Box
            sx={{
              height: { sm: "calc(100vh - 60px)", lg: "calc(100vh - 60px)", xl: "calc(100vh - 80px)" },
            }}
          >
            {/* <Content /> */}
            <Box
              sx={{
                p: 4,
                height: { sm: "calc(100vh - 60px)", lg: "calc(100vh - 60px)", xl: "calc(100vh - 80px)", },
                overflowY: "auto",
              }}
            >
              <Outlet />{" "}
              {/* children router'slar shu yerda rendering bo'ladi. */}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {ConfirmDialog}
    </>
  ) 
}

export default MainLayout 
