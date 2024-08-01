import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../theme';
import '../App.css';
import { Box, Button } from '@mui/material';
import Header from '../components/Header';
import { useTheme } from '@emotion/react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import idivipl_axios from '../utils/axiosConfig';
import IDataGrid from '../components/DataGrid';


function District() {
  const theme = useTheme();
  const usernameRef = useRef(null);
  const colors = tokens(theme.palette.mode)
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [formValues, setFormValues] = useState({
    cityname: '',
    districtcode: '',
    status: true,
    C_Date: new Date().toISOString().slice(0, 16),
    C_User: 1,
    C_Node: 1
  });

  const updateData = (data, columnToHide = "usercode") => {
    // Extract columns from keys of the first data object
    const cols = Object.keys(data[0]).map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: 150,
      hide: key === columnToHide,
    }));

    const handleEditClick = (params) => {
      setOpen(true);
      console.log(params);
      setFormValues({
        usercode: params.row.usercode,
        username: params.row.username,
        userlevel: params.row.userlevel.trim(),
        emp_ID: params.row.emp_ID,
        status: params.row.status,
        C_Date: params.row.C_Date,
        C_User: params.row.C_User,
        C_Node: params.row.C_Node
      });
    };

    const handleDeleteClick = async (params) => {
      // Your delete logic here
      try {
        await idivipl_axios.delete(`api/users/${params.row.usercode}`);
        alert('User deleted successfully');
        fetchData();
        // Function to refresh the user list after deletion
      } catch (error) {
        console.error('Error deleting user', error);
        alert('Failed to delete user');
      }
    };

    // Assign IDs to rows
    const updatedRows = data.map((row, index) => ({ id: index, ...row }));

    // Create the actions column
    const actionsColumn = {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <strong>
          <IconButton
            color="primary"
            aria-label="edit"
            size="small"
            onClick={() => handleEditClick(params)}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            color="secondary"
            aria-label="delete"
            size="small"
            onClick={() => handleDeleteClick(params)}
          >
            <DeleteIcon fontSize="inherit" htmlColor="#de1010"/>
          </IconButton>
        </strong>
      ),
    };

    // Add the actions column to the beginning of the columns array
    if (cols.length > 0) {
      cols.unshift(actionsColumn);
    }

    // Update state
    setColumns(cols);
    setRows(updatedRows);
  };


  // New User Popup component Open
  const handleClickOpen = () => {
   
    setFormValues({
      districtname: '',
      statecode: '',
      status: true,
      C_Date: new Date().toISOString().slice(0, 16),
      C_User: 1,
      C_Node: 1
    });
    setOpen(true);
    
  };

  // New User Popup Component Close
  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = () => {
    idivipl_axios.get("/api/userlist")
      .then(res => {
        // if (isMounted) { // Check if the component is still mounted
        setData(res.data);
        updateData(res.data);
        // }
      })
      .catch(err => {
        // if (isMounted) { // Check if the component is still mounted
        //   console.error('Error fetching data:', err);
        // }
      });
  }

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted
    fetchData();
    setColumnVisibilityModel({ usercode: false });
    return () => {
      isMounted = false; // Cleanup function to set the flag to false
    };
    if (open) {
      usernameRef.current.focus();
    }
  }, [open]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: name === 'status' ? Boolean(value) : value });
  };


  const fnUserSave = async () => {
    try {
      await idivipl_axios.post('api/add-user', formValues);
      alert('User added successfully');
      setFormValues({
        districtname: '',
        statecode: '',
        status: false,
        C_Date: new Date().toISOString().slice(0, 16), // Reset to current date and time
        C_User: 1, // Reset to your desired default value
        C_Node: 1  // Reset to your desired default value
      });
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error adding user: ', error);
      alert('Error adding user');
    }
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="IDIVIPL" subtitle="City" />
        <Box>
          <Button onClick={handleClickOpen}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.blueAccent[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 500, width: '100%' }}>
        {/* Call DataGrid Higher Order Component (HOC) */}
        <IDataGrid 
         rows={rows} 
         columns={columns} 
         columnVisibilityModel={columnVisibilityModel} />

        {/* <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
          columnVisibilityModel={columnVisibilityModel}
        /> */}
      </Box>

      {/* New User Dialog Component */}
      <Dialog open={open} onClose={handleClose}
        maxWidth="md" // Optional: set maximum width of the dialog
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            height: '350px',
          },
        }}
      >
        <DialogTitle>{"New District"}</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              autoFocus
              inputRef={usernameRef}
              margin="dense"
              label="District Name"
              name="districtname"
              type="text"
              fullWidth
              value={formValues.districtname}
              InputProps={{
                autoFocus: true,
              }}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                name="state"
                value={formValues.statecode}
                onChange={handleChange}
              >
                <MenuItem value="Ad">Admin</MenuItem>
                <MenuItem value="L">Limited</MenuItem>
              </Select>
            </FormControl>
            {/* <TextField
              margin="dense"
              label="Employee ID"
              name="emp_ID"
              type="text"
              fullWidth
              value={formValues.emp_ID}
              onChange={handleChange}
            /> */}
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={formValues.status}
                onChange={handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>InActive</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={fnUserSave}>Save</Button>
          <Button variant='contained' color='error' onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default District;
