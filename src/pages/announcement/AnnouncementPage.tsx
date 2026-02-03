import toastNotify from "@/shared/components/toastNotify"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { Box, Button, Chip, Grid, IconButton, Link, Popper, PopperPlacementType, Stack, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRowId, GridRowModel, useGridApiRef } from "@mui/x-data-grid"
import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { ROUTES } from "@/shared/constants/routes"
import { useTranslation } from "react-i18next"
import { AnnouncementStateType } from "./types/RequestTypes"
import { useGetAllAnnouncementsMutation, useDeleteAnnouncementMutation } from "./api/announcementAPI"
import { AnnouncementRow } from "./types/AnnouncementRow"
import CommonUtils from "@/shared/utils/CommonUtils"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import notifyAPI from "../notification/api/notifyAPI"

function AnnouncementPage() {

  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]) 
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 }) 
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 
  const [openAction, setOpenAction] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementRow | null>(null)

  // DataGrid API ref
  const dataGridApiRef = useGridApiRef()
    
  //Translation
  const { t, i18n } = useTranslation(["headers", "buttons"])

  // Api call
  // Fetch announcements

  const navigate = useNavigate()

  const [getAllAnnouncements, { data: allAnnouncements, isLoading, isSuccess, isError }] = useGetAllAnnouncementsMutation()
  const [deleteAnnouncementMutation] = useDeleteAnnouncementMutation()

  console.log("All Announcements:", allAnnouncements)

  useEffect(() => {
    getAllAnnouncements({
      pageSize: pageFormat.pageSize,
      offset: pageFormat.offset
    })
  }, [pageFormat.pageSize, pageFormat.offset, getAllAnnouncements])


  useEffect(() => {
    if(isSuccess && (allAnnouncements?.resultCode == RESULTCODE.SUCCESS)) {
      setAnnouncements(allAnnouncements.resultData || []) 
      setTotalRows(allAnnouncements?.resultData.total || 0) 
    }
    
    if(isError && allAnnouncements?.resultCode != RESULTCODE.SUCCESS) {
      toastNotify("Error fetching notifications", "error") 
    }

  }, [
    isSuccess, 
    allAnnouncements,
    isError
  ]) 

  const id = openAction ? 'simple-popper' : undefined
  const handleActionClick = (announcement: AnnouncementRow) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedAnnouncement(announcement)
    setAnchorEl(event.currentTarget) 
    setOpenAction((prev) => !prev)
  }

  const columns: GridColDef<AnnouncementRow>[] = useMemo(
    () => [
      { field: "announcement_id", headerName: "Id", width: 50 },
      {
        field:"title",
        headerName: t("Title", { ns: "headers" }),
        width: 140
      },
      { field: "body", headerName: t("Body", { ns: "headers" }), width: 220 },
      { field: "preview", headerName: t("Preview", { ns: "headers" }), width: 200, flex: 1 },
      {
        field: "scope",
        headerName: t("Scope", { ns: "headers" }),
        width: 180,
        renderCell: params => {
          return (
            <Chip label={params.row.scope} />
          )
        }
      },
      {
        field: "is_active",
        headerName: t("Status", { ns: "headers" }),
        width: 180,
        renderCell: params => {
          return (
            <Chip label={params.row.is_active ? t("Active", { ns: "texts" }) : t("Inactive", { ns: "texts" }) } color={params.row.is_active ? "success" : "error"} size="small"></Chip>
          ) 
        },
      }, 
      {
        field: "created_at_utc",
        headerName: t("CreatedAt", { ns: "headers" }),
        width: 180,
        renderCell: params => {
          const formatted = CommonUtils.ConvertUtcToLocal(params.row.created_at_utc)
          return (
            <span>{formatted}</span>
          ) 
        }
      },
      {
        field: "actions",
        headerName: t("Actions", { ns: "headers" }),
        width: 80,
        renderCell: params => {
          return (
            <IconButton id={params.row.announcement_id.toString()} onClick={handleActionClick(params.row)}>
              <MoreVertIcon />
            </IconButton>
          ) 
        },
      },
    ],
    [t]
  ) 

  // Navigation to register announcement page
  const handleCreateAnnouncementBtn = () => {
    const state : AnnouncementStateType = {
      scope: "BROADCAST",
      targets: []
    }

    navigate(ROUTES.ADMIN.ANNOUNCEMENTS.CREATE, { state } )
  }


  // Handle announcement delete
  function handleAnnouncementDelete(): void {
    if(selectedAnnouncement) {

      const selectedRows: Map<GridRowId, GridRowModel> | undefined = dataGridApiRef.current?.getSelectedRows()

      // Get selected announcement IDs
      const idList: number[] = []
      selectedRows?.forEach((row) => {
        idList.push(row.announcement_id)
      })
           
      if(idList.length > 0) {
        deleteAnnouncementMutation( { id_list: idList })
          .then( (res) => {
            if(res.data?.resultCode == RESULTCODE.SUCCESS) { 
              toastNotify("Announcement(s) deleted successfully", "success")
              setOpenAction(false)
              // Refresh announcements list
              getAllAnnouncements({
                pageSize: pageFormat.pageSize,
                offset: pageFormat.offset
              })
            } else {
              toastNotify("Failed to delete announcement(s)", "error")
            }
          })
      } else {
        toastNotify("No announcements selected for deletion", "warning")
      }
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
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("Announcements", { ns: "sidebar" })}</Typography>
          <Button variant="contained" onClick={ handleCreateAnnouncementBtn }>{t("CreateAnnouncement", { ns: "buttons" })}</Button>

        </Stack>
        <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
          <DataGrid 
            key={i18n.language}
            rows={announcements || []} 
            columns={columns} 
            apiRef={dataGridApiRef}
            checkboxSelection
            disableRowSelectionOnClick
            getRowId={r => r.announcement_id} 
            loading={isLoading}
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
              })) 
            }}
          /> 
          <Popper id={id} open={openAction} anchorEl={anchorEl} placement={'bottom-end' as PopperPlacementType} sx={{ width: 160, zIndex: 9999 }}> 
            <Box sx={{ border: '1px solid #d9d9d9', p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Button
                sx={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start' }}
                fullWidth
                variant="text"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleAnnouncementDelete() }
              >
                { t("Delete", { ns: "texts" }) } 
              </Button>
            </Box>
          </Popper>
        </Box>
      </Grid>
    </>
  ) 
}

export default AnnouncementPage 
