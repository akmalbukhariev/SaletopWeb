import { useAuth } from "@/features/auth" 
import { ROUTES } from "@/shared/constants/routes" 
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material" 
import { useState } from "react" 
import { useNavigate } from "react-router" 

function LoginForm() {
  const navigate = useNavigate() 
  const { signIn } = useAuth() 
  const [admin_id, setAdminId] = useState("") 
  const [password, setPassword] = useState("") 
  const [isRememberMe, setIsRememberMe] = useState(false) 
  const [loading, setLoading] = useState(false) 
  const [error, setError] = useState<string | null>(null) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() 
    setLoading(true) 
    setError(null) 
    try {
      const response = await signIn({ admin_id, password }, isRememberMe) 
      console.log("res", response) 
      if (response) {
        localStorage.removeItem(atob("selectedSidebar")) 
        navigate(ROUTES.HOME, { replace: true }) 
      }
    } catch (err) {
      console.log(err) 
      setError(err instanceof Error ? err.message : "Login failed") 
    } finally {
      setLoading(false) 
    }
  } 

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack spacing={3} sx={{ minWidth: "350px" }}>
        <Box>
          <TextField
            fullWidth
            label="User Name"
            variant="outlined"
            value={admin_id}
            onChange={e => setAdminId(e.target.value)}
            required
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Box>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isRememberMe}
                onChange={e => setIsRememberMe(e.target.checked)}
              />
            }
            label="Remember Me"
          />
          <Typography variant="body2" color="primary">
            <Link href="#" underline="hover">
              {" "}
              Forgot Password?
            </Link>
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{" "}
            <Link href="/auth/register" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Box>
  ) 
}

export default LoginForm 
