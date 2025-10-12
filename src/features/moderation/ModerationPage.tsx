import toastNotify from "@/shared/components/toastNotify"
import { useConfirm } from "@/shared/hooks/useConfirm"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { Avatar, Box, Button, Chip, Collapse, Fade, Grid, Stack, Switch, Typography, Zoom } from "@mui/material"
import { DataGrid, GridColDef, GridRowId, GridRowModel, GridValidRowModel, useGridApiRef } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useApprovalPosterListMutation,
  useGetNewAddedPosterListQuery,
  useGetPosterListQuery
} from "../company/api/companyAPI"
import { ModerationRow } from './type/ModerationType'

function ModerationPage() {

  const [rows, setRows] = useState<ModerationRow[]>([]) 
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 }) 
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 

  const dataGridApiRef = useGridApiRef()

  const [filterType, setFilterType] = useState<"all" | "newAdded">("all")

  const { confirm, ConfirmDialog } = useConfirm()

  //Translation
  const { t, i18n } = useTranslation(["headers", "texts", "buttons", "sidebar"])
  
  const [approvalPosterList] = useApprovalPosterListMutation()

  // to see selected item photos
  const [selectedItem, setSelectedItem] = useState<ModerationRow>()

  //APi call
  const { 
    data: allPosterList, 
    isSuccess: isPosterSuccess, 
    isLoading : isPosterLoading
  } = useGetPosterListQuery(
    {
      offset: pageFormat.offset * pageFormat.pageSize,
      pageSize: pageFormat.pageSize,
    },
    {
      skip: filterType !== "all",
    }
  )

  const {
    data: newAddedPosterList,
    isSuccess: isNewAddedPosterSuccess,
    isLoading: isNewAddedPosterLoading,
  } = useGetNewAddedPosterListQuery(
    {
      offset: pageFormat.offset * pageFormat.pageSize,
      pageSize: pageFormat.pageSize,
    },
    {
      skip: filterType !== "newAdded",
    }
  )
  useEffect(() => {
    if(filterType === "all" && isPosterSuccess && allPosterList?.resultData) {
      setRows(allPosterList.resultData.data || [])
      setTotalRows(allPosterList.resultData?.total || pageFormat.pageSize)
    } else if(filterType === "newAdded" && isNewAddedPosterSuccess && newAddedPosterList?.resultData) {
      setRows(newAddedPosterList.resultData.data || [])
      setTotalRows(newAddedPosterList.resultData?.total || pageFormat.pageSize)
    }

    if(filterType === "all" && isPosterSuccess && allPosterList?.resultCode != RESULTCODE.SUCCESS) {
      toastNotify("Error fetching data all", "error")
      setRows([])
    } else if(filterType === "newAdded" && isNewAddedPosterSuccess && newAddedPosterList?.resultCode != RESULTCODE.SUCCESS) {
      toastNotify("Error fetching data newAdded", "error")
      setRows([])
    }

  }, [
    filterType,
    isPosterSuccess,
    isNewAddedPosterSuccess,
    allPosterList,
    newAddedPosterList,
    pageFormat.pageSize,
  ])

  const columns: GridColDef<ModerationRow>[] = useMemo(
    () => [
      {
        field: "image_url",
        headerName: t("Profile", { ns: "headers" }),
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: params => (
          <Avatar
            src={params.value as string}
            sx={{ width: 36, height: 36 }}
          />
        ),
      },
      {
        field: "company_name",
        headerName: t("Company", { ns: "headers" }),
        width: 200,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "category",
        headerName: t("Category", { ns: "headers" }),
        width: 200,
        flex: 1,
        minWidth: 100,
      },
      { field: "title", headerName: t("Title", { ns: "headers" }), width: 130 },
      { field: "description", headerName: t("Description", { ns: "headers" }), width: 350, minWidth: 200, flex:1 },
      {
        field: "new_price",
        headerName: t("NewPrice", { ns: "headers" }),
        width: 120,
        type: "number",
      },
      {
        field: "old_price",
        headerName: t("OldPrice", { ns: "headers" }),
        width: 120,
        type: "number",
      },
      {
        field: "deleted",
        headerName: t("Deleted", { ns: "headers" }),
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
      {
        field: "created_at",
        headerName: t("CreatedAt", { ns: "headers" }),
        width: 170,
      },
      {
        field: "updated_at",
        headerName: t("UpdatedAt", { ns: "headers" }),
        width: 170,
      },
      {
        field: "actions",
        headerName: t("Actions", { ns: "headers" }),
        width: 160,
        renderCell: params => {
          return (
            <Chip 
              clickable 
              label={ params.row.approved === null ? t("Pending", { ns:"texts" }) : params.row.approved ? t("Approved", { ns: "texts" }) : t("NotApproved", { ns: "texts" }) } 
              color={params.row.approved === null ? "warning" : params.row.approved ? "success" : "error"}
              onClick={() => {
                handlePosterApproving([params.row])
              }}  
            />
          ) 
        },
      }
    ],
    [t]
  ) 
          
  const handleFilterAction = (value: any) => {
    setFilterType(value)
  }

  const handlePosterApproving = async (rows: ModerationRow[] | GridValidRowModel[], isApproved: boolean = true) => {

    rows.forEach(row => {
      if(row.approved) {
        toastNotify("Already approved", "warning")
        return
      }
    })

    const notApprovedRows = rows.filter(row => !row.approved)
    
    const description = isApproved ? "Are you sure you want to approve this poster?" : "Are you sure you want to reject this poster?"

    if(notApprovedRows.length && await confirm("Approve poster", description, isApproved ? 'confirm' : 'delete'))
    {
      try {
        const posterList = notApprovedRows.map((row) => {
          return {
            company_id: row.company_id,
            poster_id: row.poster_id,
            title: row.title,
            approved: isApproved
          }
        })

        const res = await approvalPosterList({
          posterList: posterList
        })
        
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
  }

  const handleAllPosterApproving = async () => {
    const selectedRows: Map<GridRowId, GridRowModel> | undefined = dataGridApiRef.current?.getSelectedRows()

    const valuesList = selectedRows?.values()

    if(valuesList) {
      const values = Array.from(valuesList)

      if(values)
      {
        await handlePosterApproving(values)
      }
    }
  }
  const handleRowClicked = (row: ModerationRow) => {
    if(row)
    {
      setSelectedItem(row)
    }
  }

  const handleItenApproveReject = async (isApproved: boolean) => {
    if(selectedItem) 
    {
      await handlePosterApproving([selectedItem], isApproved)
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2, flexShrink: 0 }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{t("Moderation", { ns: "sidebar" })}</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button variant='contained' color={filterType === "all" ? "success" : 'inherit'} onClick={() => handleFilterAction("all")}>
            {t("All", { ns: "buttons" })} 
          </Button>
          <Button variant="contained" color={filterType === "newAdded" ? "success" : 'inherit'} onClick={() => handleFilterAction("newAdded")}>
            {t("NewPosters", { ns: "buttons" })}
          </Button>
          <Button disabled={isPosterLoading || isNewAddedPosterLoading} variant="contained" color='primary' onClick={() => handleAllPosterApproving()}>
            {t("ApproveAll", { ns: "buttons" })}
          </Button>
        </Box>
      </Stack>
      <Grid container spacing={2} columns={{ md: 12 }} sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "auto" }}>
        <Grid size={{ md: selectedItem ? 9 : 12 }} >
          <DataGrid 
            key={i18n.language}
            apiRef={dataGridApiRef}
            checkboxSelection
            disableRowSelectionOnClick
            rows={rows} 
            columns={columns} 
            getRowId={row => row.poster_id}
            loading={isPosterLoading || isNewAddedPosterLoading}
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
            onRowClick={(params) => handleRowClicked(params.row as ModerationRow)}
          /> 
        </Grid>
        <Zoom in={selectedItem ? true : false}>
          <Grid display={selectedItem ? "flex" : "none"} container flexDirection='column' size={{ md: 3 }} sx={{ border: '1px solid #e1e1e1', borderRadius: 1, p:2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}>
              <Box sx={{ mb: 2, overflow: "hidden" }}>
                <Typography variant='h4' sx={{ mb: 1 }}>
                  {selectedItem?.title}
                </Typography>
                <Typography>
                  {selectedItem?.description}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", height:"50%", maxWidth: 400, maxHeight: { sm:200, md: 400 }, objectFit: 'cover', borderRadius: 4 }}>
                <img src={selectedItem?.image_url} style={{ height: "100%", width: "100%", borderRadius: 4 }}/>
              </Box>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Button sx={{ fontSize: { sm: 10, md: 12, lg:14 } }} variant='contained' onClick={() => handleItenApproveReject(true)}>{t("Approve", { ns: "buttons" })}</Button>
                <Button sx={{ fontSize: { sm: 10, md: 12, lg:14 } }} variant='contained' color='error' onClick={() => handleItenApproveReject(false)}>{t("Reject", { ns: "buttons" })}</Button>
              </Box>
              <Box sx={{ mt:'auto', display: "flex", justifyContent  : "flex-end" }}>
                <Button variant='outlined' color='error' onClick={() => setSelectedItem(undefined)} sx={{ mt: 2 }}>{t("Close", { ns: "buttons" })}</Button>
              </Box>
            </Box>
          </Grid>
        </Zoom>
      </Grid>
      {ConfirmDialog}
    </Grid>
  ) 
}

export default ModerationPage 
