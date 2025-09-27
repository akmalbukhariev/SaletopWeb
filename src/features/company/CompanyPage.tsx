import {
  Avatar,
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Company } from "@/shared/types/CompanyType";
import { useEffect, useMemo, useState } from "react";
import { useChangeCompanyDeletionStatusMutation, useGetAllCompaniesQuery } from "./api/companyAPI";
import { useChangeCompanyStatusMutation } from "./api/companyAPI";
import { RESULTCODE } from "@/shared/utils/ResultCode";
import CustomAlert from "@/shared/components/CustomAlert";

function CompanyPage() {
  const [rows, setRows] = useState<Company[]>();
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize);

  const [changeCompanyStatus] = useChangeCompanyStatusMutation();
  const [changeCompanyDeletionStatus] = useChangeCompanyDeletionStatusMutation();

  const {
    data: allCompanies,
    isSuccess,
  } = useGetAllCompaniesQuery({
    offset: pageFormat.offset * pageFormat.pageSize,
    pageSize: pageFormat.pageSize,
  });



  useEffect(() => {
    if (isSuccess && allCompanies?.resultData) {
      console.log("allCompanies", allCompanies);
      setRows(allCompanies.resultData?.users || []);
      setTotalRows(allCompanies.total);
      // setRows(allCompanies.data);
      // setTotalRows(allCompanies.total);
    }
  });

  const columns: GridColDef<Company>[] = useMemo(
    () => [
      {
        field: "logo_url",
        headerName: "Logo",
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Avatar
            src={params.value as string}
            alt={params.row.company_name}
            sx={{ width: 36, height: 36 }}
          />
        ),
      },
      {
        field: "company_name",
        headerName: "Company",
        width: 200,
        flex: 1,
        minWidth: 150,
      },
      { field: "phone_number", headerName: "Phone", width: 150 },
      {
        field: "email",
        headerName: "Email",
        width: 220,
        flex: 1,
        minWidth: 100,
      },
      { field: "business_type", headerName: "Type", width: 130 },
      { field: "rating", headerName: "Rating", width: 100, type: "number" },
      {
        field: "status",
        headerName: "Status",
        width: 120,
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
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch checked={params.row.notification_enabled} size="small" />
        ),
      },
      {
        field: "deleted",
        headerName: "Deleted",
        width: 100,
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
      { field: "working_hours", headerName: "Working Hours", width: 180 },
      { field: "telegram_link", headerName: "Telegram", width: 180 },
      { field: "social_profile_link", headerName: "Social", width: 180 },
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
    phone_number?: string,
    status?: string
  ) => {
    if (phone_number && status) {
      try {
        const res = await changeCompanyStatus({ phone_number, status });
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
        const res = await changeCompanyDeletionStatus({ deleted, phone_number });
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, flexShrink: 0 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Companies</Typography>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          getRowId={r => r.company_id} 
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



export default CompanyPage;
