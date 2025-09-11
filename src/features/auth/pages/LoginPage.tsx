import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <Box sx={{ minWidth: '400px', mx: 'auto', p: 3, border: '1px solid', borderRadius: '8px' }}>
      <h2>Login</h2>
      {/* Add your login form here */}
      <LoginForm />
    </Box>
  )
}

export default LoginPage;