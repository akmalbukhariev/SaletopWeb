import CustomAlert from "@/shared/components/CustomAlert";
import { UserRow, UserStatus } from "@/shared/types/UserType";
import { RESULTCODE } from "@/shared/utils/ResultCode";
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import UserAPI from "./api/UserAPI";

function formatDate(value: string): string {
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return value;
  }
}

function UserPage() {
  const [rows, setRows] = useState<UserRow[]>();

  const [pageFormat, setPageFormat] = useState({
      offset: 2,
      pageSize: 10
  })

  const [totalRows, setTotalRows] = useState(pageFormat.pageSize)
  const [selectUser, setSelectUser] = useState<string>("All");
  
  useEffect(()=>{
    const fetchUsers = async() => {
      const res = await UserAPI.getAllUsers(pageFormat);
      if(res.resultCode == RESULTCODE.SUCCESS){
          
        setRows(res.resultData?.users)    
        setTotalRows(res.resultData?.total)
      }
      else{
        CustomAlert({
          message: res.resultMsg,
          type:'error',
        })
      }
    }
    fetchUsers()
  },[pageFormat])



  const handleChangeSy



  const handleToggleField = (
    id: string,
    field: "notification_enabled" | "deleted"
  ) => {
    // setRows(prev =>
    //   prev.map(row =>
    //     row.user_id === id
    //       ? {
    //           ...row,
    //           [field]: (row[field] === 1 ? 0 : 1) as 0 | 1,
    //           updated_at: new Date().toISOString(),
    //         }
    //       : row
    //   )
    // );
  };

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
        width: 130,
        renderCell: params => {
          const value = params.value as UserStatus;
          const color =
            value === "ACTIVE"
              ? "success"
              : value === "INACTIVE"
                ? "error"
                : "default";
          return (
            <Chip
              size="small"
              label={value}
              color={color}
              variant={color === "default" ? "outlined" : "filled"}
            />
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
          <Switch
            checked={params.row.notification_enabled === 1}
            onChange={() =>
              handleToggleField(params.row?.user_id, "notification_enabled")
            }
            size="small"
          />
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
            checked={params.row.deleted === 1}
            onChange={() => handleToggleField(params.row.user_id, "deleted")}
            size="small"
            color="warning"
          />
        ),
      },
      {
        field: "created_at",
        headerName: "Created",
        width: 170,
        valueGetter: params => formatDate(params as string),
      },
      {
        field: "updated_at",
        headerName: "Updated",
        width: 170,
        valueGetter: params => formatDate(params as string),
      },
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
        <Typography variant="h6">Users</Typography>
        <FormControl size="small" sx={{ width: "180px" }}>
          <InputLabel id="demo-simple-select-label">Users</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectUser}
            label="Age"
            onChange={event => setSelectUser(event.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Banned">Banned</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <DataGrid
          getRowId={(row) => row.user_id}
          rows={rows || []}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: pageFormat.pageSize, page: pageFormat.offset } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={{
            page: pageFormat.offset,
            pageSize: pageFormat.pageSize,
          }}
          rowCount={totalRows} // <-- This tells DataGrid the total number of rows for server-side pagination
          paginationMode="server" // <-- Enable server-side pagination
          onPaginationModelChange={({ page, pageSize }) => {
            console.log(page, pageSize)
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
