import { Avatar, Box, Button, Grid, Switch } from "@mui/material" 
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid" 
import { useEffect, useState } from "react" 
import { ROUTES } from "@/shared/constants/routes" 
import { useNavigate } from "react-router" 
import { useGetAllAdminQuery, useDeleteAdminByIdMutation } from "./api/adminPageAPI" 
import { RESULTCODE } from "@/shared/utils/ResultCode" 
import CustomAlert from "@/shared/components/CustomAlert" 


function AdminPage() {
  const [admins, setAdmins] = useState([]) 
  const navigate = useNavigate() 
  const [deleteAdminById] = useDeleteAdminByIdMutation() 


  const { data: allAdmins, isSuccess } = useGetAllAdminQuery({}) 

  useEffect(() => {
    if (isSuccess && allAdmins?.resultData) {
      console.log("allAdmins", allAdmins) 
      setAdmins(allAdmins.resultData || []) 
    }
  }, [allAdmins?.resultData, isSuccess]) 

  //Grid Format
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "User",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar
          src={params.value as string}
          alt={(params.row as { name?: string }).name || ""}
          sx={{ width: 36, height: 36 }}
        />
      ),
    },
    { field: "admin_id", headerName: "Name", width: 300, flex: 1 },
    { field: "admin_role", headerName: "Role", width: 300 },
    { field: "created_at", headerName: "Created At", width: 250 },
    { field: "updated_at", headerName: "Updated At", width: 250 },
    {
      field: "deleted",
      headerName: "Deleted",
      width: 150,
      editable: false,
      renderCell: params => (
        <Switch
          checked={params.row.deleted}
          onChange={() => handleAdminDelete(params.row.admin_id)}
        ></Switch>
      ),
    },
  ] 


  const handleAdminDelete = async (admin_id: number | string) => {

    if (admin_id) {
      console.log("admin_id", admin_id) 
      const res = await deleteAdminById(`${admin_id}`) 

      console.log(res) 
      if (res?.data?.resultCode == RESULTCODE.SUCCESS) {
        CustomAlert({ 
          message: "Admin successfully deleted.", 
          type: "success"
        }) 
      } else {
        CustomAlert({
          message: "Admin can't be deleted.", 
          type: "error"
        }) 
      }
    }
  } 

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
      <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Admin Panel</Box>
      <Box sx={{ fontSize: 14, mb: 2 }}>Manage admins and master admin</Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => navigate(ROUTES.AUTH.REGISTER)}
        >
          Create Admin
        </Button>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={admins}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </Box>
    </Grid>
  ) 
}

export default AdminPage 



