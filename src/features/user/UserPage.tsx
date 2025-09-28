import CustomAlert from "@/shared/components/CustomAlert";
import { UserRow } from "@/shared/types/UserType";
import { RESULTCODE } from "@/shared/utils/ResultCode";
import {
  Avatar,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import {
  useChangeUserDeletionStatusMutation,
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
} from "./api/UserAPI";

function UserPage() {
  const [rows, setRows] = useState<UserRow[]>();
  const [pageFormat, setPageFormat] = useState({
    offset: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize);
  const { data: allUsers, isSuccess } = useGetAllUsersQuery({
    offset: pageFormat.offset * pageFormat.pageSize,
    pageSize: pageFormat.pageSize,
  });

  const [changeUserStatus] = useChangeUserStatusMutation();
  const [changeUserDeletionStatus] = useChangeUserDeletionStatusMutation();

  useEffect(() => {
    if (isSuccess && allUsers?.resultData) {
      console.log(allUsers.resultData.users);
      setRows(allUsers.resultData.users || []);
      if (typeof allUsers.resultData.total === "number") {
        setTotalRows(allUsers.resultData.total);
      }
    }
  }, [isSuccess, allUsers]);

  const columns: GridColDef<UserRow>[] = useMemo(
    () => [
      {
        field: "profile_picture_url",
        headerName: "Profile",
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<UserRow>) => (
          <Avatar
            src={params.row.profile_picture_url}
            alt={params.row.full_name}
            sx={{ width: 36, height: 36 }}
          />
        ),
      },
      { field: "first_name", headerName: "First name", width: 100 },
      { field: "last_name", headerName: "Last name", width: 100 },
      { field: "full_name", headerName: "Full name", width: 180, flex: 1 },
      { field: "phone_number", headerName: "Phone", width: 160 },
      { field: "email", headerName: "Email", width: 220, flex: 1 },
      {
        field: "status",
        headerName: "Status",
        width: 180,
        renderCell: params => {
          return (
            <FormControl fullWidth variant="standard">
              <Select
                value={params.row.status}
                sx={{
                  borderRadius: "0",
                  mt: 2,
                  color: params.row.status == "INACTIVE" ? "red" : 
                  params.row.status == "BANNED" ? "orange" : "green",
                }}
                onChange={e =>
                  handleUserStatusChange(
                    params.row.phone_number,
                    e.target.value
                  )
                }
              >
                 <MenuItem value="ACTIVE" sx={{ color: "green" }}>
                  ACTIVE
                </MenuItem>
                <MenuItem value="INACTIVE" sx={{ color: "red" }}>
                  INACTIVE
                </MenuItem>
                 <MenuItem value="BANNED" sx={{ color: 'orange' }}>
                  BANNED
                </MenuItem>
              </Select>
            </FormControl>
          );
        },
      },
      {
        field: "notification_enabled",
        headerName: "Notify",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch checked={params.row.notification_enabled} size="small" />
        ),
      },
      {
        field: "deleted",
        headerName: "Deleted",
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch
            checked={params.row.deleted}
            size="small"
            color="warning"
            onChange={e =>
              handleUserDeletionChange(
                e.target.checked,
                params.row.phone_number
              )
            }
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created",
        width: 170,
      },
      {
        field: "updated_at",
        headerName: "Updated",
        width: 170,
      },
    ],
    []
  );

  const handleUserStatusChange = async (
    phone_number: string,
    status: string
  ) => {
    if (phone_number && status) {
      try {
        const res = await changeUserStatus({ phone_number, status });
        console.log(res);
        if (res.data?.resultCode == RESULTCODE.SUCCESS) {
          console.log(res);
          CustomAlert({
            message: res.data?.resultMsg,
            type: "success",
          });
        } else {
          CustomAlert({
            message: res.data?.resultMsg,
            type: "error",
          });
        }
      } catch (error) {
        CustomAlert({
          message: error as string,
          type: "error",
        });
      }
    }
  };

  const handleUserDeletionChange = async (
    deleted: boolean,
    phone_number: string
  ) => {
    if (phone_number) {
      try {
        const res = await changeUserDeletionStatus({ deleted, phone_number });
        console.log(res);
        if (res.data?.resultCode == RESULTCODE.SUCCESS) {
          console.log(res);
          CustomAlert({
            message: res.data?.resultMsg,
            type: "success",
          });
        } else {
          CustomAlert({
            message: res.data?.resultMsg,
            type: "error",
          });
        }
      } catch (error) {
        CustomAlert({
          message: error as string,
          type: "error",
        });
      }
    }
  };

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
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <DataGrid
          getRowId={row => row.user_id}
          rows={rows || []}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: pageFormat.pageSize,
                page: pageFormat.offset,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
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
export default UserPage;
