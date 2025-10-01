
import { ROUTES } from "@/shared/constants/routes" 
import { Visibility, VisibilityOff } from "@mui/icons-material" 
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material" 
import { useState } from "react" 
import { AdminRole } from "../type/AdminRole" 
import { IRegistretInfo } from "../type/IRegisterInfo" 
import { useRegisterUserMutation } from "../api/authAPI"  
import { RESULTCODE } from "@/shared/utils/ResultCode" 
import { useNavigate } from "react-router" 
import toastNotify from "@/shared/components/toastNotify"

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false) 
  const [showPasswordConfirm, setShowPassworConfirm] = useState(false) 
  const [registerUser] = useRegisterUserMutation() 

  const navigate = useNavigate() 

  const [adminInfo, setAdminInfo] = useState<IRegistretInfo>({
    admin_id: "",
    admin_role: AdminRole[0].name,
    password: "",
    confirmPassword: "",
  }) 

  const handleSubmit = async () => {
    if (
      !adminInfo.admin_id.length ||
      !adminInfo.admin_role ||
      adminInfo.password !== adminInfo.confirmPassword
    ) {
      toastNotify(
        "Please check information.",
        "warning",
      ) 

      return
    }

    const user = {
      admin_id: adminInfo.admin_id,
      admin_role: adminInfo.admin_role,
      password: adminInfo.password,
    } 

    const{ data } = await registerUser(user) 

    if(data.resultCode == RESULTCODE.SUCCESS){
      toastNotify(
        "User successfully registered.",
        "success") 

      navigate(ROUTES.AUTH.LOGIN) 
    } else {
      toastNotify(
        "Registration failed. Please try again.",
        "error"
      ) 
    }
  } 

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          minWidth: "500px",
          mx: "auto",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
          borderRadius: "8px",
        }}
      >
        <Stack spacing={3} sx={{ p: 4 }}>
          <Box sx={{ fontSize: 28, fontWeight: "bold", textAlign: "center" }}>
            Sign Up
          </Box>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Create your account to get started!
          </Typography>
          {/* User Name */}
          <Box>
            <TextField
              fullWidth
              label="User Name"
              variant="outlined"
              value={adminInfo.admin_id}
              onChange={e =>
                setAdminInfo({
                  ...adminInfo,
                  admin_id: e.target?.value,
                })
              }
            />
          </Box>
          {/* <Box>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
            />
          </Box> */}
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              value={adminInfo.password}
              onChange={e =>
                setAdminInfo({
                  ...adminInfo,
                  password: e.target?.value,
                })
              }
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          {/* Password Confirm */}
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password-confirm">
              Password Confirm
            </InputLabel>
            <OutlinedInput
              error={adminInfo.password !== adminInfo.confirmPassword}
              value={adminInfo.confirmPassword}
              onChange={e =>
                setAdminInfo({
                  ...adminInfo,
                  confirmPassword: e.target?.value,
                })
              }
              fullWidth
              id="outlined-adornment-password-confirm"
              type={showPasswordConfirm ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassworConfirm(!showPasswordConfirm)}
                    edge="end"
                  >
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password Confirm"
            />
            {adminInfo.confirmPassword &&
              adminInfo.password !== adminInfo.confirmPassword && (
              <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                  Passwords do not match.
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              Select user role
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={adminInfo.admin_role}
              label="Select user role"
              onChange={event =>
                setAdminInfo({
                  ...adminInfo,
                  admin_role: event.target.value,
                })
              }
            >
              {AdminRole.map(role => (
                <MenuItem key={role.id} value={role.value}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Sign Up
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
              Already you have an account?{" "}
              <Link href={ROUTES.AUTH.LOGIN} underline="hover">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  ) 
}

export default RegisterPage 
