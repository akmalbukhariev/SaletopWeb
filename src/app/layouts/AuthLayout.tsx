import { Box } from "@mui/material" 
import { Outlet } from "react-router" 

function AuthLayout() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </Box>
  ) 
}

export default AuthLayout 
