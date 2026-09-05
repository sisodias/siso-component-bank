import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  { field: "age", headerName: "Age", type: "number", width: 90 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (_, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const initialRows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export function BasicTable() {
  const [rows] = React.useState(initialRows);

  return (
    <Paper
      className="
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        rounded-xl shadow-md p-1
      "
      sx={{
        height: 420,
        width: "100%",
        position: "relative",
        // let DataGrid cells inherit the Tailwind colors
        "& .MuiDataGrid-root": {
          color: "inherit",
          backgroundColor: "transparent",
        },
        "& .MuiDataGrid-cell": {
          borderColor: "rgba(156,163,175,0.2)", // gray-400/20
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          color: "inherit",
          backgroundColor: "transparent",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "transparent",
            color: "inherit",
          },
        }}
      />
    </Paper>
  );
}
