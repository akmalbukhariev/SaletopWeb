import {  Box, Chip, Grid, Stack, Typography } from "@mui/material";
import {useGetAllNotificationsQuery} from "./api/notifyAPI";
import { useEffect, useMemo, useState } from "react";
import { RESULTCODE } from "@/shared/utils/ResultCode";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NotificationType } from "@/shared/types/NotificationType";

function NotificationPage() {

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize);
  
  const {isSuccess, isError, data: allNofications } = useGetAllNotificationsQuery(null);

   console.log("Notifications data:", allNofications);

  useEffect(() => {
    if(isSuccess && (allNofications?.resultCode == RESULTCODE.SUCCESS || allNofications?.resultCode == RESULTCODE.FOUND)) {
        setNotifications(allNofications.resultData || []);
        setTotalRows(allNofications.total || 0);
    }else if(allNofications?.resultCode == RESULTCODE.TOKEN_INVALID) {
      console.error("Invalid token. Please log in again.");
    }
    if(isError) {
      console.error("Error fetching notifications");
    }

  }, [allNofications]);

  const columns: GridColDef<NotificationType>[] = useMemo(
    () => [
      { field: "id", headerName: "Id", width: 50 },
      { field: "delivery_date", headerName: "Delivery Date", width: 200 },
      { field: "message", headerName: "Message", width: 200, flex: 1 },
      { field: "sends", headerName: "Sends", width: 160 },
      {
        field: "status",
        headerName: "Status",
        width: 180,
        renderCell: params => {
          return (
            <Chip label={params.row.status} color={params.row.status === "Failed" ? "error" : "success"} size="small"></Chip>
          );
        },
      }
    ],
    []
  );

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
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Notifications</Typography>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
         <DataGrid 
          rows={notifications || []} 
          columns={columns} 
          getRowId={r => r.id} 
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
            }));
          }}
          /> 
      </Box>
    </Grid>
  );
}

export default NotificationPage;
