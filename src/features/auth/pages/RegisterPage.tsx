import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button,  FormControl,  IconButton,  InputAdornment,  InputLabel,  Link, MenuItem, OutlinedInput, Select, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react";


function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPassworConfirm] = useState(false);
  
  const AdminRole = ['Super Admin', 'Admin', 'Moderator'];
  const [selectedRole, setSelectedRole] = useState<string>(AdminRole[0]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{ minWidth: '500px', mx: 'auto', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)', borderRadius: '8px' }}>
        <Stack spacing={3} sx={{ p: 4 }}>
          <Box sx={{ fontSize: 28, fontWeight: 'bold',textAlign: 'center' }}>Sign Up</Box>
          <Typography variant="body1" sx={{textAlign: 'center' }}>Create your account to get started!</Typography>
          {/* User Name */}
          <Box>
              <TextField fullWidth label="User Name" variant="outlined" />
          </Box>
          <Box>
              <TextField fullWidth label="Email" variant="outlined" type="email"  />
          </Box>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput fullWidth 
                id='outlined-adornment-password' 
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
          </FormControl>
          {/* Password Confirm */}
          <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password-confirm">Password Confirm</InputLabel>
                <OutlinedInput fullWidth 
                  id='outlined-adornment-password-confirm' 
                  type={showPasswordConfirm ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassworConfirm(!showPasswordConfirm)}
                        edge="end"
                      >
                        {showPasswordConfirm ? <VisibilityOff/> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password Confirm"
                />
            </FormControl>
            <FormControl fullWidth size="small" >
              <InputLabel id="demo-simple-select-label">Select user role</InputLabel>
              <Select 
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedRole}
                  label="Select user role"
                  onChange={(event) => setSelectedRole(event.target.value)}
                >
                  {AdminRole.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          <Button variant="contained" color="primary">Sign Up</Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="textSecondary">Already you have an account? <Link href="/auth/login"  underline="hover">Sign In</Link></Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default RegisterPage