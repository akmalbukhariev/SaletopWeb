import toastNotify from "@/shared/components/toastNotify" 
import { UserRow } from "@/features/user/type/UserType" 
import { RESULTCODE } from "@/shared/utils/ResultCode" 
import {
  Avatar,
  Box,
  Grid,
  Switch,
  Chip,
  IconButton,
  Popper,
  PopperPlacementType,
  Popover,
  Button,
  Typography,
  ClickAwayListener,
  // IconButton
} from "@mui/material" 
import BlockIcon from "@mui/icons-material/Block"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid" 
import { useEffect, useMemo, useState } from "react" 
import {
  useChangeUserDeletionStatusMutation,
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
} from "./api/UserAPI" 
import React from "react"
import { useConfirm } from "@/shared/hooks/useConfirm"
import AddAlertIcon from '@mui/icons-material/AddAlert'
import { useNavigate } from "react-router"
import { ROUTES } from "@/shared/constants/routes"
import { useAppSelector } from "@/store/hooks"

function UserPage() {

  const [rows, setRows] = useState<UserRow[]>() 
  const [pageFormat, setPageFormat] = useState({
    offset: 0,
    pageSize: 10,
  }) 

  const [openAction, setOpenAction] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 
  const { data: allUsers, isSuccess, isLoading, isError } = useGetAllUsersQuery({
    offset: pageFormat.offset * pageFormat.pageSize,
    pageSize: pageFormat.pageSize,
  }) 
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  const [changeUserStatus] = useChangeUserStatusMutation() 
  const [changeUserDeletionStatus] = useChangeUserDeletionStatusMutation() 

  const { confirm, ConfirmDialog } = useConfirm()
  const navigate = useNavigate()

  const search = useAppSelector(state => state.search.value)

  useEffect(() => {
    if (isSuccess && allUsers?.resultData) {
      console.log(allUsers.resultData) 
      setRows(allUsers.resultData || []) 
      if (typeof allUsers.resultData.total === "number") {
        setTotalRows(allUsers.resultData.total) 
      }
    }

    if(isError && allUsers?.resultCode !== RESULTCODE.SUCCESS) {
      toastNotify(
        allUsers?.resultMsg || "Failed to fetch users",
        "error",
      ) 
    }
  }, [
    isSuccess, 
    allUsers,
    pageFormat.pageSize
  ]) 

  const id = openAction ? 'simple-popper' : undefined
  const handleActionClick = (user: UserRow) => (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("handleActionClick", user)
    setSelectedUser(user)
    setAnchorEl(event.currentTarget) 
    setOpenAction((prev) => !prev)
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    setOpenAction(false)

  }
    
  const columns: GridColDef<UserRow>[] = useMemo(
    () => [
      {
        field: "profile_picture_url",
        headerName: "Profile",
        width: 60,
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
      { field: "phone_number", headerName: "Phone", width: 140 },
      { field: "email", headerName: "Email", width: 220, flex: 1 },
      { 
        field: "status",
        headerName: "Status",
        width: 120,
        renderCell: params => {
          let color = "green" 
          if (params.value === "INACTIVE") color = "red" 
          else if (params.value === "BANNED") color = "orange" 
          return (
            <Chip label={params.value} 
              sx={{ 
                backgroundColor: color, 
                fontWeight: 'bold',
                color: 'white' 
              }}/>
          ) 
        },
      },
      {
        field: "notification_enabled",
        headerName: "Notify",
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch checked={params.row.notification_enabled} size="small" />
        ),
      },
      {
        field: "radius_km",
        headerName: "Radius (km)",
        width: 100,
      },
      {
        field: "deleted",
        headerName: "Deleted",
        width: 90,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch
            checked={params.row.deleted}
            size="small"
            color="warning"
          />
        ),
      },
      {
        field: "violation_count",
        headerName: "Violations",
        width: 80,
      },
      {
        field: "blocked_until",
        headerName: "Blocked Until",
        width: 160,
      },
      {
        field: "created_at",
        headerName: "Created",
        width: 160,
      },
      {
        field: "updated_at",
        headerName: "Updated",
        width: 160,
      },
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
    ],
    []
  ) 

  const handleUserStatusChange = async (
    phone_number: string,
    status: string
  ) => {
    if (phone_number && status) {
      if(await confirm("Change User status", `Are you sure you want to change this user status to ${status == 'BANNED' ? "BANNED" : "UNBLOCK"}?`, 'confirm'))
      {
        try {
          const res = await changeUserStatus({ phone_number, status }) 
          console.log(res) 
          if (res.data?.resultCode == RESULTCODE.SUCCESS) {
            console.log(res) 
            toastNotify(
              res.data?.resultMsg,
              "success"
            ) 
          } else {
            toastNotify(
              res.data?.resultMsg,
              "error",
            ) 
          }
        } catch (error) {
          toastNotify(
          error as string,
          "error",
          ) 
        }
      }

      handleActionClose()
    }
  } 

  const handleUserDeletionChange = async (
    deleted: boolean,
    phone_number: string
  ) => {
    
    if (phone_number) {

      if(await confirm("Delete soft?", `Are you sure you want to mark this user as ${deleted ? "deleted" : "not deleted"}?`, 'delete'))
      {
        try {
          const res = await changeUserDeletionStatus({ deleted, phone_number }) 
          console.log(res) 
          if (res.data?.resultCode == RESULTCODE.SUCCESS) {
            console.log(res) 
            toastNotify(
              res.data?.resultMsg,
              "success",
            ) 

          } else {
            toastNotify(
              res.data?.resultMsg,
              "error",
            ) 
          }
        } catch (error) {
          toastNotify(
          error as string,
          "error",
          ) 
        }

        handleActionClose()
      }
    }
  } 

  const handleAddNotification = (phone_number: string): void => {

    if (phone_number) {
      navigate( {
        pathname: ROUTES.ADMIN.NOTIFICATIONS.SEND,
        search: `?company=no&phone_number=${phone_number}`
      })
    }
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
        <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden", position: "relative" }}>
          <DataGrid
            getRowId={row => row.user_id}
            editMode="row"
            rows={rows || []}
            columns={columns}
            loading={isLoading}
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
              })) 
            }}
          />
          <Popper id={id} open={openAction} anchorEl={anchorEl} placement={'bottom-end' as PopperPlacementType} sx={{ width: 160, zIndex: 9999 }}> 
            <Box sx={{ border: '1px solid #d9d9d9', p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="error"
                onClick={() => {
                  handleUserStatusChange(selectedUser?.phone_number ? selectedUser?.phone_number : "", selectedUser?.status == "BANNED" ? "INACTIVE" : "BANNED") 
                }}
                startIcon={<BlockIcon />}
              >
                { selectedUser?.status == "BANNED" ? "Unblock" : "Block" } 
              </Button>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleUserDeletionChange(selectedUser?.deleted ? false : true, selectedUser?.phone_number ? selectedUser?.phone_number : "") }
              >
                { selectedUser?.deleted ? "Not deleted" : "Deleted (sotf)" } 
              </Button>
              <Button 
                onClick={() => handleAddNotification(selectedUser?.phone_number ? selectedUser?.phone_number : "")}
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="success"
                startIcon={<AddAlertIcon />}>
                  Add Notif..
              </Button>
            </Box>
          </Popper>
        </Box>
      </Grid>
      { ConfirmDialog } 
    </>
  ) 
}
export default UserPage 
