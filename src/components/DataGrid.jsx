import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";

const IDataGrid = (props) => {

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }


  return (
    <DataGrid
      rows={props.rows}
      columns={props.columns}
      excelOptions={{ allColumns: true }}
      csvOptions={{ allColumns: true }}
      slots={{
        toolbar: CustomToolbar,
      }}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      //  ExcelExport={props.ExcelExport}
      columnVisibilityModel={props.columnVisibilityModel}
    />
  )
}

export default IDataGrid;