import { NotificationRow } from "@/pages/notification/type/NotificationType"
import toastNotify from "@/shared/components/toastNotify"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { Box, Button, Chip, Grid, IconButton, Link, Stack, Typography } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useMemo, useState } from "react"
import { useGetAllNotificationsQuery } from "./api/notifyAPI"
import { useNavigate } from "react-router"
import { ROUTES } from "@/shared/constants/routes"
import { useTranslation } from "react-i18next"

function NotificationPage() {

  const [notifications, setNotifications] = useState<NotificationRow[]>([]) 
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 }) 
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 
  

  //Translation
  const { t, i18n } = useTranslation(["headers", "buttons"])


  // Api call
  const { isSuccess, isError, data: allNofications, isLoading } = useGetAllNotificationsQuery({
    offset: pageFormat.offset,
    pageSize: pageFormat.pageSize
  }) 

  const navigate = useNavigate()

  useEffect(() => {
    if(isSuccess && (allNofications?.resultCode == RESULTCODE.SUCCESS)) {
      setNotifications(allNofications.resultData.data || []) 
      setTotalRows(allNofications?.resultData.total || 0) 
    }
    
    if(isError && allNofications?.resultCode != RESULTCODE.SUCCESS) {
      toastNotify("Error fetching notifications", "error") 
    }

  }, [
    isSuccess, 
    allNofications,
    pageFormat.pageSize
  ]) 

  const columns: GridColDef<NotificationRow>[] = useMemo(
    () => [
      { field: "id", headerName: "Id", width: 50 },
      {
        field:"phone_number",
        headerName: t("Phone", { ns: "headers" }),
        width: 140
      },
      { field: "delivery_date", headerName: t("DeliveryDate", { ns: "headers" }), width: 200 },
      { field: "message", headerName: t("Message", { ns: "headers" }), width: 200, flex: 1 },
      { field: "sends", headerName: t("Sends", { ns: "headers" }), width: 160 },
      {
        field: "company",
        headerName: t("Type", { ns: "headers" }),
        width: 180,
        renderCell: params => {
          return (
            <Chip label={params.row.company ? t("Company", { ns: "headers" }) : t("User", { ns: "headers" })} />
          )
        }
      },
      {
        field: "status",
        headerName: t("Status", { ns: "headers" }),
        width: 180,
        renderCell: params => {
          return (
            <Chip label={params.row.status ?? t("Failed", { ns: "texts" }) } color={params.row.status ? "success" : "error"} size="small"></Chip>
          ) 
        },
      }
    ],
    [t]
  ) 

  return (
    <Grid
      sx={{
        borderRadius: 4,
        boxShadow: 2,
        height: "100%",
        width: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, flexShrink: 0 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("Notifications", { ns: "sidebar" })}</Typography>

        <Button variant="contained" onClick={() => navigate(ROUTES.ADMIN.NOTIFICATIONS.SEND) }>{t("CreateNotification", { ns: "buttons" })}</Button>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <DataGrid 
          key={i18n.language}
          rows={notifications || []} 
          columns={columns} 
          getRowId={r => r.id} 
          loading={isLoading}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pageFormat.pageSize,
                page: pageFormat.offset,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20, 25]}
          paginationModel={{
            page: pageFormat.offset,
            pageSize: pageFormat.pageSize,
          }}
          rowCount={totalRows} // <-- This tells DataGrid the total number of rows for server-side pagination
          paginationMode="server" // <-- Enable server-side pagination
          onPaginationModelChange={({ page, pageSize }) => {
            setPageFormat(prev => ({
              ...prev,
              offset: page,
              pageSize: pageSize,
            })) 
          }}
        /> 
      </Box>
    </Grid>
  ) 
}

export default NotificationPage 
