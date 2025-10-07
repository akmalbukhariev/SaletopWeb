import { Avatar, Box, Button, Chip, Grid, Stack, Switch, Typography } from "@mui/material" 
import { useCallback, useEffect, useMemo, useRef, useState } from "react" 
import { DataGrid, DataGridProps, GridColDef, GridRowId, GridRowModel, GridValidRowModel, useGridApiRef } from '@mui/x-data-grid'
import { 
  useApprovalPosterListMutation,
  useGetNewAddedPosterListQuery,
  useGetPosterListQuery
} from "../company/api/companyAPI"
import { ModerationRow } from './type/ModerationType'
import { useConfirm } from "@/shared/hooks/useConfirm"
import toastNotify from "@/shared/components/toastNotify"
import { RESULTCODE } from "@/shared/utils/ResultCode"
import { GridRowSelectionModel } from "@mui/x-data-grid"
import { data } from "react-router"

function ModerationPage() {

  const [rows, setRows] = useState<ModerationRow[]>([]) 
  const [pageFormat, setPageFormat] = useState({ offset: 0, pageSize: 10 }) 
  const [totalRows, setTotalRows] = useState(pageFormat.pageSize) 

  const dataGridApiRef = useGridApiRef()

  const [filterType, setFilterType] = useState<"all" | "newAdded">("all")

  const { confirm, ConfirmDialog } = useConfirm()

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
      setRows(allPosterList.resultData || [])
      setTotalRows(allPosterList.resultData?.total || pageFormat.pageSize)
    } else if(filterType === "newAdded" && isNewAddedPosterSuccess && newAddedPosterList?.resultData) {
      setRows(newAddedPosterList.resultData || [])
      setTotalRows(newAddedPosterList.resultData?.total || pageFormat.pageSize)
    }

    if(filterType === "all" && allPosterList?.resultCode != RESULTCODE.SUCCESS) {
      toastNotify("Error fetching data", "error")
      setRows([])
    } else if(filterType === "newAdded" && newAddedPosterList?.resultCode != RESULTCODE.SUCCESS) {
      toastNotify("Error fetching data", "error")
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
        headerName: "Profile",
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
        headerName: "Company",
        width: 200,
        flex: 1,
        minWidth: 150,
      },
      {
        field: "category",
        headerName: "Category",
        width: 200,
        flex: 1,
        minWidth: 100,
      },
      { field: "title", headerName: "Title", width: 130 },
      { field: "description", headerName: "Description", width: 350 },
      {
        field: "new_price",
        headerName: "New Price",
        width: 100,
        flex: 1,
        type: "number",
      },
      {
        field: "old_price",
        headerName: "Old Price",
        width: 100,
        flex: 1,
        type: "number",
      },
      { field: "click_to_contact_count", headerName: "Contact_count", width: 100, type: "number" },
      {
        field: "deleted",
        headerName: "Deleted",
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
        headerName: "Created",
        width: 170,
      },
      {
        field: "updated_at",
        headerName: "Updated",
        width: 170,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        renderCell: params => {
          return (
            <Chip 
              clickable 
              label={ params.row.approved ? "Approved" : "Pending"} 
              color={params.row.approved ? "success" : "warning"}
              onClick={() => {
                handlePosterApproving([params.row])
              }}  
            />
          ) 
        },
      }
    ],
    []
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
            poster_id: row.poster_id,
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
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Moderation</Typography>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button variant='contained' color={filterType === "all" ? "success" : 'inherit'} onClick={() => handleFilterAction("all")}>
            Hammasini 
          </Button>
          <Button variant="contained" color={filterType === "newAdded" ? "success" : 'inherit'} onClick={() => handleFilterAction("newAdded")}>
            Yangi posterlar
          </Button>
          <Button sx={{ textDecoration: 'none', textTransform: 'none' }} variant="contained" color='primary' onClick={() => handleAllPosterApproving()}>
            Hammasini tasdiqlash
          </Button>
        </Box>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflow: "hidden" }}>
        <DataGrid 
          apiRef={dataGridApiRef}
          checkboxSelection
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
      </Box>
      {ConfirmDialog}
    </Grid>
  ) 
}

export default ModerationPage 
