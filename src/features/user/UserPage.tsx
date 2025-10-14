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
  Button,
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
import { useTranslation } from "react-i18next"

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

  console.log("allUsers", allUsers)


  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  //Translation
  const { t, i18n } = useTranslation(["headers", "texts"])

  const [changeUserStatus] = useChangeUserStatusMutation() 
  const [changeUserDeletionStatus] = useChangeUserDeletionStatusMutation() 

  const { confirm, ConfirmDialog } = useConfirm()
  const navigate = useNavigate()


  useEffect(() => {
    if (isSuccess && allUsers?.resultData) {
      setRows(allUsers.resultData.data || []) 
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
        headerName: t("Profile", { ns: "headers" }),
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
      { field: "first_name", headerName: t("FirstName", { ns: "headers" }), width: 100 },
      { field: "last_name", headerName: t("LastName", { ns: "headers" }), width: 100 },
      { field: "full_name", headerName: t("FullName", { ns: "headers" }), width: 180, flex: 1 },
      { field: "phone_number", headerName: t("Phone", { ns: "headers" }), width: 140 },
      { field: "email", headerName: t("Email", { ns: "headers" }), width: 220, flex: 1 },
      { 
        field: "status",
        headerName: t("Status", { ns: "headers" }),
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
        headerName: t("Notify", { ns: "headers" }),
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch checked={params.row.notification_enabled} size="small" />
        ),
      },
      {
        field: "radius_km",
        headerName: t("Radius", { ns: "headers" }) + ' (km)',
        width: 100,
      },
      {
        field: "deleted",
        headerName: t("Deleted", { ns: "headers" }),
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
        headerName: t("Violations", { ns: "headers" }),
        width: 80,
      },
      {
        field: "blocked_until",
        headerName: t("BlockedUntil", { ns: "headers" }),
        width: 160,
      },
      {
        field: "created_at",
        headerName: t("CreatedAt", { ns: "headers" }),
        width: 160,
      },
      {
        field: "updated_at",
        headerName: t("UpdatedAt", { ns: "headers" }),
        width: 160,
      },
      {
        field: "actions",
        headerName: t("Actions", { ns: "headers" }),
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
    [t]
  ) 

  const handleUserStatusChange = async (
    phone_number: string,
    status: string
  ) => {
    if (phone_number && status) {
      const message = status == 'BANNED' ? t("changeUserStatusBlock", { ns: "messages" }) : t("changeUserStatusUnblock", { ns: "messages" })
      if(await confirm(
        "Change User status", 
        message,
        'confirm'))
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
      const message = deleted ? t("changeUserDelete", { ns: "messages" }) : t("changeUserUnDelete", { ns: "messages" })
      if(await confirm(
        "Delete soft?", 
        message, 
        'delete'))
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
            key={i18n.language}
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
          <Popper id={id} open={openAction} anchorEl={anchorEl} placement={'bottom-end' as PopperPlacementType} sx={{ minWidth: 160, zIndex: 9999, }}> 
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
                { selectedUser?.status == "BANNED" ? t("Unblock", { ns: "texts" }) : t("Block", { ns: "texts" }) } 
              </Button>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleUserDeletionChange(selectedUser?.deleted ? false : true, selectedUser?.phone_number ? selectedUser?.phone_number : "") }
              >
                { selectedUser?.deleted ? t("Undelete", { ns: "texts" }) : t("DeleteSoft", { ns: "texts" }) } 
              </Button>
              <Button 
                onClick={() => handleAddNotification(selectedUser?.phone_number ? selectedUser?.phone_number : "")}
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="success"
                startIcon={<AddAlertIcon />}>
                { t("AddNotification", { ns: "texts" }) }
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
