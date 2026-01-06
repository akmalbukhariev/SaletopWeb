import { Box, Divider, Grid, Typography } from "@mui/material" 
import { PieChart } from '@mui/x-charts/PieChart'
import { useTranslation } from "react-i18next"
import { useGetCompanyStatisticsQuery, useGetUserStatisticsQuery, useGetSystemStatusQuery } from "./api/dashboardAPI"
import {
  useGetNewAddedPosterListQuery,
  useGetPosterListQuery
} from "../company/api/companyAPI"
import { useState } from "react"

const cardStyle = {
  display: 'flex',
  flexDirection: 'column', 
  width:'100%', 
  height:"100%", 
  border: '1px solid #d9d9d9',
  p: 2, 
  borderRadius: 2,
  overflow: 'hidden'
}

const fontSizeResponsive = {
  xs: 6, // extra-small
  sm: 6, // small
  md: 10, // medium
  lg: 12, // large
  xl: 18  // extra-large
}

const borderStyle = '1px solid #d9d9d9'
  
function MainPage() {

  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 }) 
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 


  // translation
  const { t, i18n } = useTranslation(["headers", "texts", "buttons", "sidebar"])

  //APi call
  const { data: companyStatistics, isSuccess: isCompanySuccess, isLoading: isCompanyLoading } = useGetCompanyStatisticsQuery(null)
  const { data: userStatistics, isSuccess: isUserSuccess, isLoading: isUserLoading } = useGetUserStatisticsQuery(null)
  const { data: systemStatus, isSuccess: isSystemSuccess, isLoading: isSystemLoading } = useGetSystemStatusQuery(null)
  const { data: allPosterList, isSuccess: isPosterSuccess, isLoading : isPosterLoading } = useGetPosterListQuery(
    {
      offset: pageFormat.offset * pageFormat.pageSize,
      pageSize: pageFormat.pageSize,
    } )
  const { data: newAddedPosterList, isSuccess: isNewAddedPosterSuccess, isLoading: isNewAddedPosterLoading, } = useGetNewAddedPosterListQuery(
    {
      offset: pageFormat.offset * pageFormat.pageSize,
      pageSize: pageFormat.pageSize,
    })



  return (
    <Grid
      container
      columns={12}
      sx={{
        borderRadius: 4,
        boxShadow: 2,
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sellers */}
      <Grid sx={{ height: "50%", width: "50%", p: 2 }}>
        <Box sx={cardStyle}>
          {/* Page Title */}
          <Typography variant="h6">
            {t("SellersInfo", { ns: "titles" })} 
          </Typography>
          <Box sx={{ display: 'flex', width: '100%', height: '100%', gap: 2 }}>

            {/* Placeholder for Chart */}
            <Box sx={{ display: 'flex', alignItems:'center', justifyContent: 'center', flex: 8, p: 2 }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: companyStatistics?.resultData?.active_users, label: t("ActiveSellers", { ns:"titles" }), color: 'green' },
                      { id: 1, value: companyStatistics?.resultData?.inactive_users, label: t("InActiveSellers", { ns:"titles" }), color: 'red' },
                      { id: 2, value: companyStatistics?.resultData?.banned_users, label: t("BannedSellers", { ns:"titles" }), color: 'black' },
                    ],
                  },
                ]}
              />
            </Box>

            {/* Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 3, }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  {t("TotalSellers", { ns:"titles" })}
                </Typography>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  <span>{companyStatistics?.resultData?.total}</span> <span>({t("AmountTa", { ns:"texts" })})</span>
                </Typography>
              </Box>
              <Divider sx={{ width:'80%' }} />
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', mt: 2, color: 'green', borderLeft: '4px solid green', pl: 1 }}>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {t("ActiveSellers", { ns:"titles" })}
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {companyStatistics?.resultData?.active_users} 
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {companyStatistics?.resultData?.active_percentage} <span style={{ fontSize: 14 }}>(%)</span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', mt: 2, color: 'red', borderLeft: '4px solid red', pl: 1 }}>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {t("InActiveSellers", { ns:"titles" })}
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {companyStatistics?.resultData?.inactive_users} 
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {companyStatistics?.resultData?.inactive_percentage} <span style={{ fontSize: 14 }}>(%)</span>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Buyers*/}
      <Grid sx={{ height: "50%", width: "50%", p: 2 }}>
        <Box sx={cardStyle}>
          <Typography variant="h6" >
            {t("BuyersInfo", { ns: "titles" })}
          </Typography>
          <Box sx={{ display: 'flex', width: '100%', height: '100%', gap: 2 }}>

            {/* Placeholder for Chart */}
            <Box sx={{ display: 'flex', alignItems:'center', justifyContent: 'center', flex: 8, p: 2 }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: userStatistics?.resultData?.active_users, label: t("ActiveBuyers", { ns:"titles" }), color: 'green' }, //t("ActiveBuyers"), color: 'green' },
                      { id: 1, value: userStatistics?.resultData?.inactive_users, label: t("InActiveBuyers", { ns:"titles" }), color: 'red' },
                      { id: 2, value: userStatistics?.resultData?.banned_users, label: t("BannedBuyers", { ns:"titles" }), color: 'black' },
                    ],
                  },
                ]}
              />
            </Box>

            {/* Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  {t("TotalBuyers", { ns:"titles" })}
                </Typography>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  <span>{userStatistics?.resultData?.total}</span> <span>({t("AmountTa", { ns:"texts" })})</span>
                </Typography>
              </Box>
              <Divider sx={{ width:'80%' }} />
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', mt: 2, color: 'green', borderLeft: '4px solid green', pl: 1 }}>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {t("ActiveBuyers", { ns:"titles" })}
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold' >
                    {userStatistics?.resultData?.active_users} 
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {userStatistics?.resultData?.active_percentage} <span style={{ fontSize: 14 }}>(%)</span>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', mt: 2, color: 'red', borderLeft: '4px solid red', pl: 1 }}>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {t("InActiveBuyers", { ns:"titles" })}
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {userStatistics?.resultData?.inactive_users} 
                  </Typography>
                  <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                    {userStatistics?.resultData?.inactive_percentage} <span style={{ fontSize: 14 }}>(%)</span>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Add Sellers summary content here */}
        </Box>
      </Grid>

      {/* System Status  */}
      <Grid sx={{ height: "50%", width: "50%", p: 2 }}>
        <Box sx={cardStyle}>
          {/* Approved and Not Approved products */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, height: '60%' }}>
            <Box border={borderStyle} sx={{ flex:1, height: '100%', borderRadius: 2, backgroundColor: 'green' }}>
              <Box sx={{ p: 2, color: 'white' }}>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  {t("ApprovedProducts", { ns:"titles" })}
                </Typography>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  {allPosterList?.resultData?.total} <span>({t("AmountDona", { ns:"texts" })})</span>
                </Typography>
              </Box>
            </Box>
            <Box border={borderStyle} sx={{ flex:1, height: '100%', borderRadius: 2, backgroundColor: 'orange' }}>
              <Box sx={{ p: 2, color: 'black' }}>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  { t("UnapprovedProducts", { ns:"titles" }) }
                </Typography>
                <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  {newAddedPosterList?.resultData?.total} <span>({t("AmountDona", { ns:"texts" })})</span>
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Server Status */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', borderRadius: 2, alignItems: 'center', p:2, mb:2, border: borderStyle, height: '20%' }}>
            <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
              {t("ServerStatus", { ns:"titles" })}: 
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: systemStatus?.overall_status == "UP" ? 'green' : "red", height: 30, width: 30, borderRadius:'50%', ml: 1, mr:1 }}>
              <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold' color='white'>
                {systemStatus?.overall_status}
              </Typography>  
            </Box>
          </Box>

          {/* Server Memory */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: borderStyle, height: '20%', borderRadius: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                {t("ServerMemory", { ns:"titles" })}:
              </Typography>
              <Typography sx={{ fontSize: fontSizeResponsive }} fontWeight='bold'>
                  65% 
              </Typography>
            </Box>
            <Box sx={{ width: '50%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: 2, mr:2 }}>
              <Box sx={{ width: '65%', height: '100%', backgroundColor: 'blue', borderRadius: 2 }}></Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Line Chart */}
      <Grid sx={{ height: "50%", width: "50%", p: 2 }}>
        <Box sx={cardStyle}>
         
        </Box>
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