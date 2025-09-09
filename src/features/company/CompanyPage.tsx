import { Avatar, Box, Chip, Grid, Stack, Switch, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Company, CompanyStatus } from "@/shared/types/CompanyType";
import { initialCompanies } from "@/shared/constants/initialCompanies";
import { useMemo, useState } from "react";

function formatDate(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}:${pad(d.getMonth() + 1)}:${pad(d.getDate())}-${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function CompanyPage() {
  const [rows, setRows] = useState<Company[]>(initialCompanies);

  const toggleField = (id: string, field: "notification_enabled" | "deleted") => {
    setRows((prev) =>
      prev.map((c) =>
        c.company_id === id
          ? { ...c, [field]: (c[field] === 1 ? 0 : 1) as 0 | 1, updated_at: new Date().toISOString() }
          : c
      )
    );
  };

  const columns: GridColDef<Company>[] = useMemo(
    () => [
      {
        field: "logo_url",
        headerName: "Logo",
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Avatar src={params.value as string} alt={params.row.company_name} sx={{ width: 36, height: 36 }} />
        ),
      },
      { field: "company_name", headerName: "Company", width: 200, flex: 1 },
      { field: "phone_number", headerName: "Phone", width: 150 },
      { field: "email", headerName: "Email", width: 220, flex: 1 },
      { field: "business_type", headerName: "Type", width: 130 },
      { field: "rating", headerName: "Rating", width: 100, type: "number" },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        renderCell: (params) => {
          const value = params.value as CompanyStatus;
          const color = value === "ACTIVE" ? "success" : value === "BANNED" ? "error" : "default";
          return <Chip size="small" label={value} color={color} variant={color === "default" ? "outlined" : "filled"} />;
        },
      },
      {
        field: "notification_enabled",
        headerName: "Notify",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Switch
            checked={params.row.notification_enabled === 1}
            onChange={() => toggleField(params.row.company_id, "notification_enabled")}
            size="small"
          />
        ),
      },
      {
        field: "deleted",
        headerName: "Deleted",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Switch
            checked={params.row.deleted === 1}
            onChange={() => toggleField(params.row.company_id, "deleted")}
            size="small"
            color="warning"
          />
        ),
      },
      { field: "working_hours", headerName: "Hours", width: 180 },
      { field: "telegram_link", headerName: "Telegram", width: 180 },
      { field: "social_profile_link", headerName: "Social", width: 180 },
      {
        field: "created_at",
        headerName: "Created",
        width: 170,
        valueFormatter: (params: { value: unknown }) => formatDate(params.value as string | null | undefined),
      },
      {
        field: "updated_at",
        headerName: "Updated",
        width: 170,
        valueFormatter: (params: { value: unknown }) => formatDate(params.value as string | null | undefined),
      },
    ],
    []
  );

  return (
    <Grid sx={{ borderRadius: 4, boxShadow: 2, height: "100%", width: "100%", p: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexShrink: 0 }}>
        <Typography variant="h6">Companies</Typography>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, width: '100%', overflow: 'hidden' }}>
        <DataGrid rows={rows} columns={columns} getRowId={(r) => r.company_id} />
      </Box>
    </Grid>
  );
}

export default CompanyPage;
