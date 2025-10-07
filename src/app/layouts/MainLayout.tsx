import { Avatar, Box, Grid, TextField } from "@mui/material" 
import SideBar from "./components/SideBar" 
import { sideBarList } from "./constants/constant" 
import { Outlet } from "react-router" 
import { setSearchValue } from "@/store/slices/searchSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useState, ChangeEvent } from "react"
function MainLayout() {

  const dispatch = useAppDispatch()
  const searchValue = useAppSelector(state => state.search.value)
  const [search, setSearch] = useState("")

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    dispatch(setSearchValue(event.target.value))
  }

  return (
    <>
      <Grid container sx={{ minWidth: "100vh", minHeight: "100vh" }}>
        {/* Left Area  */}
        <Grid size={2} sx={{ height: "100vh", borderRight: "1px solid grey" }}>
          <Box
            sx={{
              p: 2,
              height: { sm: "70px", lg: "60px", xl: "80px" },
              borderBottom: "1px solid grey",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              color: "green",
              fontWeight: "bold",
              fontSize: { sm: "16px", lg: "24px", xl: "26px" },
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
              height: { sm: "70px", lg: "60px", xl: "80px" },
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
              value={search}
              sx={{ width: "50%" }}
              onChange={handleSearchChange}
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
    </>
  ) 
}

export default MainLayout 
