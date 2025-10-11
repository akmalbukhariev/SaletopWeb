import { Avatar, Box, Button, Chip, Grid, Stack, Switch, Typography } from "@mui/material" 
import { useEffect, useMemo, useState } from "react" 
import { DataGrid, GridColDef, GridRowId, GridRowModel, GridValidRowModel, useGridApiRef } from '@mui/x-data-grid'
import { 
  useApprovalPosterListMutation,
  useGetNewAddedPosterListQuery,
  useGetPosterListQuery
} from "../company/api/companyAPI"
import { ModerationRow } from './type/ModerationType'
import { useConfirm } from "@/shared/hooks/useConfirm"
import toastNotify from "@/shared/components/toastNotify"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { useTranslation } from "react-i18next"

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
      { field: "description", headerName: t("Description", { ns: "headers" }), width: 350 },
      {
        field: "new_price",
        headerName: t("NewPrice", { ns: "headers" }),
        width: 100,
        flex: 1,
        type: "number",
      },
      {
        field: "old_price",
        headerName: t("OldPrice", { ns: "headers" }),
        width: 100,
        flex: 1,
        type: "number",
      },
      { field: "click_to_contact_count", headerName: t("ContactCount", { ns: "headers" }), width: 100, type: "number" },
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
        width: 120,
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

  const handlePosterApproving = async (rows: ModerationRow[] | GridValidRowModel[]) => {

    rows.forEach(row => {
      if(row.approved) {
        toastNotify("Already approved", "warning")
        return
      }
    })

    const notApprovedRows = rows.filter(row => !row.approved)
    
    if(notApprovedRows.length && await confirm("Approve poster", `Are you sure you want to approve this poster?`, 'confirm'))
    {
      try {
        const posterList = notApprovedRows.map((row) => {
          return {
            company_id: row.company_id,
            poster_id: row.poster_id,
            title: row.title,
            approved: true
          }
        })

        const res = await approvalPosterList({
          posterList: posterList
        })
        
        console.log(res) 
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
        handlePosterApproving(values)
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
      <Grid container spacing={2} columns={{ md: 12 }} sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <Grid size={{ md: 9 }} >
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
          /> 
        </Grid>
        <Grid size={{ md: 3 }} sx={{ border: '1px solid #e1e1e1', borderRadius: 1 }}>
          
        </Grid>
      </Grid>
    </Grid>
  ) 
}

export default ModerationPage 
