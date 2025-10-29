import { Box, Grid, Typography } from "@mui/material" 
import React from "react" 

function MainPage() {
  return (
    <Grid
      container
      columns={12}
      spacing={2}
      sx={{
        borderRadius: 4,
        boxShadow: 2,
        height: "100%",
        width: "100%",
        p: 2,
        overflow: "hidden",
      }}
    >
      {/* Sellers and Buyers Summary */}
      <Grid size={12} sx={{ height: "20%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
        <Box sx={{ display: "flex", height: "90%", width: "100%", alignItems: "center", justifyContent: "flex-start", gap: 2 }} >
          {/* Seller */}
          
          <Box sx={{ 
            p: 2,
            display: "flex", 
            flexDirection: 'column', 
            height: "100%", 
            width: { lg: 300 },
            alignItems: "flex-start", 
            justifyContent: 'space-evenly', 
            boxShadow: 2, borderRadius: 2,
          }}>
            <Typography variant="h4" >
                Active Sellers
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
                Total Sellers: 19
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <Box sx={{ display: "block", width: '10px', height: '10px', borderRadius: "50%", backgroundColor: "#00c950", alignItems: "center", justifyContent: "center" }}/>
              <Typography variant="h4" sx={{ color: "green" }}>
             5
              </Typography>
            </Box>
          </Box>

          {/* Buyer */}
          <Box sx={{ 
            p: 2,
            display: "flex", 
            flexDirection: 'column', 
            height: "100%", 
            width: { lg: 300 }, 
            alignItems: "flex-start", 
            justifyContent: 'space-evenly', 
            boxShadow: 2, borderRadius: 2,
          }}>
            <Typography variant="h4" >
                Active Buyer
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
                Total Buyers: 22
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <Box sx={{ display: "block", width: '10px', height: '10px', borderRadius: "50%", backgroundColor: "#9810fa", alignItems: "center", justifyContent: "center" }}/>
              <Typography variant="h4" sx={{ color: "green" }}>
             5
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid size={12} sx={{ height: "60%", border: "1px solid #d9d9d9", borderRadius: 2 }}>

      </Grid>

      {/* System Status  */}
      <Grid size={12} sx={{ height: { xs: "8%", sm: "10%", md: "12%", lg:"14%", xl:"16%" }, border: "1px solid #d9d9d9", borderRadius: 2 }}>
      </Grid>
    </Grid>
  ) 
}

export default MainPage 

//Company
// "resultData": {
//   "total": 19,
//   "active_percentage": "26.32%",
//   "active_users": 5,
//   "inactive_users": 14,
//   "banned_percentage": "0.00%",
//   "inactive_percentage": "73.68%",
//   "banned_users": 0
// },



// User
//  "resultData": {
//     "total": 22,
//     "active_percentage": "45.45%",
//     "active_users": 10,
//     "inactive_users": 10,
//     "banned_percentage": "4.55%",
//     "inactive_percentage": "45.45%",
//     "banned_users": 1
//   },




// Status

//   "overall": "UP",
//   "services": {},
//   "version": "admin-status 1.0.0",
//   "checkedAt": "2025-10-21T16:29:04.697900918Z"