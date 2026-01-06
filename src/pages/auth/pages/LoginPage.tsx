import { Box, Typography } from "@mui/material" 
import LoginForm from "../components/LoginForm" 

function LoginPage() {
  // const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
  // const TOKEN_KEY = `${APP_PREFIX}_token`
  // const USER_KEY = `${APP_PREFIX}_user`
  
  // if(localStorage.getItem(TOKEN_KEY) || localStorage.getItem(USER_KEY)){
  //   localStorage.removeItem(TOKEN_KEY)
  //   localStorage.removeItem(USER_KEY)
  // }

  return (
    <Box
      sx={{
        minWidth: "400px",
        mx: "auto",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ p: 4 }}>
        {/* Add your login form here */}
        <Box
          sx={{ fontSize: 28, fontWeight: "bold", mb: 2, textAlign: "center" }}
        >
          Login
        </Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Welcome back
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
          Enter your credentials to log in.
        </Typography>
        <LoginForm />
      </Box>
    </Box>
  ) 
}

export default LoginPage 
