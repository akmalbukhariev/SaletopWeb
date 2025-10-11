import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Popper,
  Stack,
  Switch,
  Typography,
} from "@mui/material" 
import { DataGrid, GridColDef } from "@mui/x-data-grid" 
import { CompanyRow } from "@/features/company/type/CompanyType" 
import { useEffect, useMemo, useState, MouseEvent, useDebugValue } from "react" 
import { useChangeCompanyDeletionStatusMutation, useGetAllCompaniesQuery } from "./api/companyAPI" 
import { useChangeCompanyStatusMutation } from "./api/companyAPI" 
import { RESULTCODE } from "@/shared/utils/ResultCode" 
import toastNotify from "@/shared/components/toastNotify"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BlockIcon from '@mui/icons-material/Block'
import DeleteIcon from '@mui/icons-material/Delete'
import { PopperPlacementType } from '@mui/material'
import { useConfirm } from "@/shared/hooks/useConfirm"
import AddAlertIcon from '@mui/icons-material/AddAlert'
import { useAppNavigation } from "@/shared/hooks/useAppNavigation"
import { useTranslation } from "react-i18next"
function CompanyPage() {
  const [rows, setRows] = useState<CompanyRow[]>([]) 
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 }) 
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 
  const [selectedCompany, setSelectedCompany] = useState<CompanyRow | null>(null)
  const [openAction, setOpenAction] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const { confirm, ConfirmDialog } = useConfirm()

  // Translation
  const { t, i18n } = useTranslation(["headers", "buttons", "sidebar", "titles", "placeholders", "texts"])

  const navigate = useAppNavigation()
  //TO use API
  const [changeCompanyStatus] = useChangeCompanyStatusMutation() 
  const [changeCompanyDeletionStatus] = useChangeCompanyDeletionStatusMutation() 

  const {
    data: allCompanies,
    isLoading,
    isSuccess,
    isError,
  } = useGetAllCompaniesQuery({
    offset: pageFormat.offset * pageFormat.pageSize,
    pageSize: pageFormat.pageSize,
  }) 

  useEffect(() => {
    if (isSuccess && allCompanies?.resultData) {
      setRows(allCompanies.resultData.data || []) 
      setTotalRows(allCompanies.resultData.total) 
    }

    if(isError && allCompanies?.resultCode !== RESULTCODE.SUCCESS) {
      toastNotify(
        allCompanies?.resultMsg || "Failed to fetch companies",
        "error",
      )
    }
  }, [
    isSuccess, 
    allCompanies,
    pageFormat.pageSize
  ]) 

  const id = openAction ? 'simple-popper' : undefined
  
  const handleActionClick = (user: CompanyRow) => (event: MouseEvent<HTMLButtonElement>) => {
    console.log("handleActionClick", user)
    setSelectedCompany(user)
    setAnchorEl(event.currentTarget) 
    setOpenAction((prev) => !prev)
  }

  const handleActionClose = () => {
    setAnchorEl(null)
    setOpenAction(false)
  }

  const columns: GridColDef<CompanyRow>[] = useMemo(
    () => [
      {
        field: "logo_url",
        headerName: t("Logo"),
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
        headerName: t("Company"),
        width: 200,
        flex: 1,
        minWidth: 150,
      },
      { field: "business_type", headerName: t("Type"), width: 130 },
      { field: "phone_number", headerName: t("Phone"), width: 150 },
      {
        field: "email",
        headerName: t("Email"),
        width: 220,
        flex: 1,
        minWidth: 100,
      },
      {
        field: "active_products",
        headerName: t("ActiveProducts"),
        width: 120,
        type: "number",
      },
      {
        field: "non_active_products",
        headerName: t("NonActiveProducts"),
        width: 120,
        type: "number",
      },
      { field: "rating", headerName: t("Rating"), width: 100, type: "number" },
      {
        field: "status",
        headerName: t("Status"),
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
        headerName: t("Notify"),
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Switch checked={params.row.notification_enabled} size="small" />
        ),
      },
      {
        field: "deleted",
        headerName: t("Deleted", { ns:"headers" }),
        width: 70,
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
      { field: "working_hours", headerName: t("WorkingHours"), width: 170 },
      { field: "telegram_link", headerName: t("Telegram"), width: 170, flex: 1, maxWidth: 170 },
      { field: "social_profile_link", headerName: t("SocialMedia"), width: 170, flex: 1, maxWidth: 170 },
      {
        field: "user_need_to_know",
        headerName: t("NeedToKnow"),
        width: 180,
        flex: 1,
        minWidth: 100,
      },
      {
        field: "about",
        headerName: t("About"),
        width: 180,
        flex: 1,
        minWidth: 100,
      },
      {
        field: "violation_count",
        headerName: t("ViolationCount"),
        width: 80  
      },
      {
        field: "created_at",
        headerName: t("CreatedAt"),
        width: 170,
      },
      {
        field: "updated_at",
        headerName: t("UpdatedAt"),
        width: 170,
      },
      {
        field: "actions",
        headerName: t("Actions"),
        width: 80,
        renderCell: params => {
          return (
            <IconButton id={id} onClick={handleActionClick(params.row)}>
              <MoreVertIcon />
            </IconButton>
          ) 
        },
      }
    ],
    [t]
  ) 

  const handleUserStatusChange = async (
    phone_number?: string,
    status?: string
  ) => {
    if (phone_number && status) {
      if(await confirm("Change company status", `Are you sure you want to change this company status to ${status == 'BANNED' ? "BANNED" : "UNBLOCK"}?`, 'confirm'))
      {
        try {
          const res = await changeCompanyStatus({ phone_number, status }) 
          console.log(res) 
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
      }

      //Close Popper
      handleActionClose()
    }
  } 

  const handleUserDeletionChange = async (
    deleted: boolean,
    phone_number: string
  ) => {
    if (phone_number) {
      if(await confirm("Delete soft?", `Are you sure you want to mark this company as ${deleted ? "deleted" : "not deleted"}?`, 'delete'))
      {
        try {
          const res = await changeCompanyDeletionStatus({ deleted, phone_number }) 
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
      }

      //Close Popper
      handleActionClose()
    }
  } 

  const handleAddNotification = (phone_number: string): void => {
  
    if (phone_number) {
      navigate.toNotificationsSend({
        company: 'yes',
        phone_number
        
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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2, flexShrink: 0 }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("Companies", { ns: 'sidebar' })}</Typography>
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
          <DataGrid 
            key={i18n.language}
            rows={rows} 
            columns={columns} 
            getRowId={r => r.company_id} 
            pageSizeOptions={[5, 10, 20, 25]}
            paginationModel={{
              page: pageFormat.offset,
              pageSize: pageFormat.pageSize,
            }}
            loading={isLoading}
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
          <Popper id={id} open={openAction} anchorEl={anchorEl} placement={'bottom-end' as PopperPlacementType} sx={{ minWidth: 160, zIndex: 9999 }}> 
            <Box sx={{ border: '1px solid #d9d9d9', p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="error"
                onClick={() => {
                  handleUserStatusChange(selectedCompany?.phone_number ? selectedCompany?.phone_number : "", selectedCompany?.status == "BANNED" ? "INACTIVE" : "BANNED") 
                }}
                startIcon={<BlockIcon />}
              >
                { selectedCompany?.status == "BANNED" ? t("Unblock", { ns: 'texts' }) : t("Block", { ns: 'texts' }) } 
              </Button>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleUserDeletionChange(selectedCompany?.deleted ? false : true, selectedCompany?.phone_number ? selectedCompany?.phone_number : "") }
              >
                { selectedCompany?.deleted ? t("Undelete", { ns: 'texts' }) : t("DeleteSoft", { ns: 'texts' }) } 
              </Button>
              <Button 
                onClick={() => handleAddNotification(selectedCompany?.phone_number ? selectedCompany?.phone_number : "")}
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="success"
                startIcon={<AddAlertIcon />}>
                {t("AddNotification", { ns: 'texts' })}
              </Button>
            </Box>
          </Popper>
        </Box>
      </Grid>
      {ConfirmDialog}
    </>
  ) 
}



export default CompanyPage 
