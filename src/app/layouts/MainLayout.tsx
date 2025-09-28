import { Avatar, Box, Grid, TextField } from "@mui/material" 
import SideBar from "./components/SideBar" 
import { sideBarList } from "./constants/constant" 
import { Outlet } from "react-router" 

function MainLayout() {
  return (
    <>
      <Grid container sx={{ minWidth: "100vh", minHeight: "100vh" }}>
        {/* Left Area  */}
        <Grid size={2} sx={{ height: "100vh", borderRight: "1px solid grey" }}>
          <Box
            sx={{
              p: 2,
              height: { lg: "60px", xl: "80px" },
              borderBottom: "1px solid grey",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              color: "green",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            {/* Company Icon */}
            Ecoplates Admin
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
              borderBottom: "1px solid gray",
              height: { lg: "60px", xl: "80px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <TextField
              size="small"
              label="Search..."
              variant="outlined"
              sx={{ width: "50%" }}
            />
            <Box
              sx={{
                ml: 2,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                src="/broken-image.jpg"
                sx={{ width: 30, height: 30, mr: 1 }}
              />
              Admin User
            </Box>
          </Box>
          <Box
            sx={{
              height: { lg: "calc(100vh - 60px)", xl: "calc(100vh - 80px)" },
            }}
          >
            {/* <Content /> */}
            <Box
              sx={{
                p: 4,
                height: { lg: "calc(100vh - 60px)", xl: "calc(100vh - 80px)" },
                overflowY: "auto",
              }}
            >
              <Outlet />{" "}
              {/* children router'slar shu yerda rendering bo'ladi. */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  ) 
}

export default MainLayout 
