import { Avatar, Box, Button, Grid, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import { AdminData } from "../../shared/constants/adminData";

const columns: GridColDef[] = [
    { field: 'avatar', headerName: 'User', width: 90, sortable: false, filterable: false, renderCell: (params: GridRenderCellParams) => (
      <Avatar src={params.value as string} alt={(params.row as { name?: string }).name || ''} sx={{ width: 36, height: 36 }} />
    ) },
    { field: 'name', headerName: 'Name', width: 350 , flex: 1 },
    { field: 'role', headerName: 'Role', width: 250 },
    { field: 'createdAt', headerName: 'Created At', width: 250},
    { field: 'updatedAt', headerName: 'Updated At', width: 250},
    { field: 'actions',
      headerName: 'Actions',
      width: 150,
      editable: false,
      renderCell: (params ) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <MoreHorizRoundedIcon key={params.row.id}/>
        </IconButton>
      )},
  ];


function AdminPage() {
  return <Grid sx={{ borderRadius: 4, boxShadow: 2, height: '100%', width: '100%', p: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
    <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>Admin Panel</Box>
    <Box sx={{ fontSize: 14, mb:2 }}>Manage admins and master admin</Box>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} >
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>Create Admin</Button>
    </Box>
    <Box sx={{flex:1, minHeight: 0, width: '100%', overflow: 'hidden'}}>
          <DataGrid
              rows={AdminData}
              columns={columns}
               initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },}}
              pageSizeOptions={[5, 10, 25, 50]}
          />
    </Box>
  </Grid>;
}

export default AdminPage;
function handleDelete(_id: number): void {
  void _id;
  throw new Error("Function not implemented.");
}

