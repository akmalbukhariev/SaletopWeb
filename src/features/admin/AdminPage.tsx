import { Avatar, Box, Button, Grid, IconButton, Popper, PopperPlacementType, Switch } from "@mui/material" 
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid" 
import React, { useEffect, useMemo, useState } from "react" 
import { ROUTES } from "@/shared/constants/routes" 
import { useNavigate } from "react-router" 
import { useGetAllAdminQuery, useDeleteAdminByIdMutation } from "./api/adminPageAPI" 
import { RESULTCODE } from "@/shared/utils/ResultCode" 
import toastNotify from "@/shared/components/toastNotify" 
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { AdminRow } from "./type/AdminRow"
import DeleteIcon from '@mui/icons-material/Delete'
import { useConfirm } from "@/shared/hooks/useConfirm"

function AdminPage() {
  const [admins, setAdmins] = useState([]) 
  const navigate = useNavigate() 
  const [deleteAdminById] = useDeleteAdminByIdMutation() 
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null)
  const [openAction, setOpenAction] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  // TO use confirm Model
  const { confirm, ConfirmDialog } = useConfirm()

  //API
  const { data: allAdmins, isSuccess } = useGetAllAdminQuery({}) 

  useEffect(() => {
    if (isSuccess && allAdmins?.resultData) {
      console.log("allAdmins", allAdmins) 
      setAdmins(allAdmins.resultData || []) 
    }
  }, [
    allAdmins, 
    isSuccess
  ]) 


  const id = openAction ? 'simple-popper' : undefined
  const handleActionClick = (admin: AdminRow) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedAdmin(admin)
    setAnchorEl(event.currentTarget) 
    setOpenAction((prev) => !prev)
  }

  //Grid Format
  const columns: GridColDef<AdminRow>[] = useMemo(() => [
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
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: params => {
        return (
          <IconButton id={id} onClick={handleActionClick(params.row)}>
            <MoreVertIcon />
          </IconButton>
        ) 
      },
    },
  ], [])

  const handleAdminDelete = async (admin_id: number | string) => {
    if (admin_id) {

      if(await confirm(
        "Delete Admin",
        "Are you sure you want to delete this admin?",
        'delete'
      ))
      {
        console.log("admin_id", admin_id) 
        const res = await deleteAdminById(`${admin_id}`) 

        console.log(res) 
        if (res?.data?.resultCode == RESULTCODE.SUCCESS) {
          toastNotify(
            "Admin successfully deleted.", 
            "success"
          ) 
        } else {
          toastNotify(
            "Admin can't be deleted.", 
            "error"
          ) 
        }
      }

      // Close Popper 
      handleClosePopure()
    }
  } 

  const handleClosePopure = () => {
    setOpenAction(false)
    setAnchorEl(null)
  }
  return (
    <>
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
          <Popper id={id} open={openAction} anchorEl={anchorEl} placement={'bottom-end' as PopperPlacementType} sx={{ width: 160, zIndex: 9999 }}> 
            <Box sx={{ border: '1px solid #d9d9d9', p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleAdminDelete(selectedAdmin?.admin_id ? selectedAdmin?.admin_id : "") }
              >
                { selectedAdmin?.deleted ? "Not deleted" : "Deleted" } 
              </Button>
            </Box>
          </Popper>
        </Box>

      </Grid>
      {ConfirmDialog}
    </>
  ) 
}

export default AdminPage 



