import toastNotify from "@/shared/components/toastNotify" 
import { UserRow } from "@/pages/user/type/UserType" 
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
  Stack,
  Typography,
  TextField,
  Zoom
} from "@mui/material" 
import BlockIcon from "@mui/icons-material/Block"
import DeleteIcon from "@mui/icons-material/Delete"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid" 
import { useEffect, useMemo, useRef, useState } from "react" 
import {
  useChangeUserDeletionStatusMutation,
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
  useGetUserByPhoneNumQuery
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

  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  const [searchPhoneNumber, setSearchPhoneNumber] = useState("")

  const [activeSearch, setActiveSearch] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedItem, setSelectedItem] = useState<UserRow>()

  const { 
    data: allUsers, 
    isSuccess: isAllSuccess, 
    isLoading: isAllLoading, 
    isError: isError 
  } = useGetAllUsersQuery({
    offset: pageFormat.offset * pageFormat.pageSize,
    pageSize: pageFormat.pageSize,
  }, {
    skip: activeSearch // Skip if activeSearch is true
  }) 

  const {
    data: searchUsers,
    isSuccess: isSearchSuccess,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useGetUserByPhoneNumQuery(searchPhoneNumber,
    {
      skip: !activeSearch || searchPhoneNumber?.trim() === "" // Skip if activeSearch is false or searchPhoneNumber is empty} 
    }
  )

  //Translation
  const { t, i18n } = useTranslation(["headers", "texts", "buttons"])

  const [changeUserStatus] = useChangeUserStatusMutation() 
  const [changeUserDeletionStatus] = useChangeUserDeletionStatusMutation() 

  const { confirm, ConfirmDialog } = useConfirm()
  const navigate = useNavigate()

  useEffect(() => {
    if(activeSearch) {
      if (isSearchSuccess && searchUsers?.resultData) {
        const searchResult = [searchUsers.resultData]
        setRows(searchResult || []) 
        if (typeof searchUsers.resultData.total === "number") {
          setTotalRows(searchUsers.resultData.total) 
        }
      }
      else if(isSearchSuccess && searchUsers.resultData == null){
        setRows([])
        setTotalRows(0)
      }
  
      if(isSearchError && searchUsers?.resultCode !== RESULTCODE.SUCCESS) {
        toastNotify(
          searchUsers?.resultMsg || "Failed to fetch users",
          "error",
        ) 
      }
    }

    if(!activeSearch) {
      if (isAllSuccess && allUsers?.resultData) {
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
    }
  }, [
    isAllSuccess,
    isSearchSuccess, 
    allUsers,
    searchUsers,
    activeSearch
  ]) 

  const id = openAction ? 'simple-popper' : undefined
  const handleActionClick = (user: UserRow) => (event: React.MouseEvent<HTMLButtonElement>) => {
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
      { field: "first_name", headerName: t("FirstName", { ns: "headers" }), width: 150, flex: 1 },
      // { field: "last_name", headerName: t("LastName", { ns: "headers" }), width: 100 },
      // { field: "full_name", headerName: t("FullName", { ns: "headers" }), width: 180, flex: 1 },
      { field: "phone_number", headerName: t("Phone", { ns: "headers" }), width: 150, flex: 1 },
      // { field: "email", headerName: t("Email", { ns: "headers" }), width: 220, flex: 1 },
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
    [i18n.language]
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
          if (res.data?.resultCode == RESULTCODE.SUCCESS) {
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
          if (res.data?.resultCode == RESULTCODE.SUCCESS) {
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

  const handleSearchReset = () => {
   
    // Input ni tozalash
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
  
    setSearchPhoneNumber("")
    setActiveSearch(false)
  }

  const handleSearchButtonClick = () => {
    const phoneNumber = searchInputRef.current?.value || ""
    console.log("phoneNumber", phoneNumber)
    if (phoneNumber) {
      setSearchPhoneNumber(phoneNumber)
      setActiveSearch(true)
    }
  }

  const paginationModel = useMemo(() => {
    return {
      page: pageFormat.offset,
      pageSize: pageFormat.pageSize,
    }
  }, [pageFormat.offset, pageFormat.pageSize])

  const handleRowClicked = (params: any) => {
    console.log("row clicked:", params)
    if(params.field === "profile_picture_url") 
    {
      setSelectedItem(params.row as UserRow)
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2, flexShrink: 0 }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("Users", { ns: 'sidebar' })}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              inputRef={searchInputRef}
              size="small"
              label={t("Search", { ns: 'texts' }) + "..."}
              variant="outlined"
              defaultValue={searchPhoneNumber}
              sx={{ width: { xs: '100%', sm: 'auto', lg: 300 } }}
              onChange={() => setActiveSearch(false)}
              onKeyDown={(e) => {
                if(e.key === "Enter"){
                  handleSearchButtonClick()
                }
              }}
            />
            <Button variant='contained' onClick={handleSearchButtonClick}>
              {t("Search", { ns: "texts" })}
            </Button>
            <Button variant='contained' color='secondary' onClick={handleSearchReset}>
              {t("Reset", { ns: "buttons" })}
            </Button>
          </Box>
        </Stack>
        <Grid container spacing={2} columns={{ md: 12 }} sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden", position: "relative" }}>
          <Grid size={{ md: selectedItem ? 9 : 12 }} sx={{ height: "100%", overflow: "hidden" }}>
            <DataGrid
              key={i18n.language}
              getRowId={row => row.user_id}
              editMode="row"
              rows={rows || []}
              columns={columns}
              loading={isAllLoading || isSearchLoading}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              rowCount={totalRows} // <-- This tells DataGrid the total number of rows for server-side pagination
              paginationMode="server" // <-- Enable server-side pagination
              onPaginationModelChange={({ page, pageSize }) => {
                setPageFormat(prev => ({
                  ...prev,
                  offset: page,
                  pageSize: pageSize,
                })) 
              }}
              onCellClick={(params) => handleRowClicked(params)}
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
          </Grid>
          <Zoom in={selectedItem ? true : false}>
            <Grid display={selectedItem ? "flex" : "none"} container flexDirection='column' size={{ md: 3 }} sx={{ border: '1px solid #e1e1e1', borderRadius: 1, p:2, overflow: 'hidden' }}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}>
                <Box sx={{ mb: 2, overflow: "hidden" }}>
                  <Typography variant='h4' sx={{ mb: 1 }}>
                    {selectedItem?.first_name}
                  </Typography>
                  <Typography>
                    {selectedItem?.phone_number}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    width: "100%", 
                    maxWidth: {
                      xs: 80,
                      sm: 100,
                      md: 180,
                      lg: 250,
                      xl: 400 
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    height: {
                      xs: 80,
                      sm: 100,
                      md: 180,
                      lg: 250,
                      xl: 400  
                    }, 
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                  <img 
                    src={selectedItem?.profile_picture_url || ""} 
                    style={{ 
                      height: "100%", 
                      width: "100%",
                      objectFit: 'cover', 
                      borderRadius: 2 
                    }}/>
                </Box>
                <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                  {/* <Button sx={{ fontSize: { sm: 10, md: 9, lg:14 } }} variant='contained' onClick={() => handleItemApproveReject(true)}>{t("Approve", { ns: "buttons" })}</Button> */}
                  {/* <Button sx={{ fontSize: { sm: 10, md: 9, lg:14 } }} variant='contained' color='error' onClick={() => handleItemApproveReject(false)}>{t("Reject", { ns: "buttons" })}</Button> */}
                </Box>
                <Box sx={{ mt:'auto', display: "flex", justifyContent  : 'space-between' }}>
                  {/* <Button variant='contained' sx={{ mt: 2, fontSize: { sm: 10, md: 9, lg:14 } }} color='error' onClick={() => handleItemDelete()} >{t("Delete", { ns: "texts" })}</Button> */}
                  <Button variant='outlined' sx={{ mt: 2, fontSize: { sm: 10, md: 9, lg:14 } }} color='error' onClick={() => setSelectedItem(undefined)} >{t("Close", { ns: "buttons" })}</Button>
                </Box>
              </Box>
            </Grid>
          </Zoom>
        </Grid>
      </Grid>
      { ConfirmDialog } 
    </>
  ) 
}
export default UserPage 
