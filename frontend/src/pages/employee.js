import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit, Delete, Search } from "@mui/icons-material";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employee";

// Styled components for better UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

export default function Employee() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "EMPLOYEE",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      setLoading(true);
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải danh sách nhân viên",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = async () => {
    try {
      await addEmployee(newEmployee);
      await fetchEmployees();
      setIsAddDialogOpen(false);
      resetForm();
      setAlert({
        open: true,
        message: "Thêm nhân viên thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể thêm nhân viên",
        severity: "error",
      });
    }
  };

  const handleEditEmployee = async () => {
    try {
      // Create a copy without password if it's empty (not changing password)
      const employeeData = { ...selectedEmployee };
      if (!employeeData.password) {
        delete employeeData.password;
      }

      await updateEmployee(selectedEmployee.id, employeeData);
      await fetchEmployees();
      setIsEditDialogOpen(false);
      setAlert({
        open: true,
        message: "Cập nhật nhân viên thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể cập nhật nhân viên",
        severity: "error",
      });
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteEmployee(selectedEmployee.id);
      await fetchEmployees();
      setIsDeleteDialogOpen(false);
      setAlert({
        open: true,
        message: "Xóa nhân viên thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể xóa nhân viên",
        severity: "error",
      });
    }
  };

  const resetForm = () => {
    setNewEmployee({
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      role: "EMPLOYEE",
    });
  };

  const openEditDialog = (employee) => {
    // Create a copy without password to avoid sending it back
    const employeeWithoutPassword = { ...employee, password: "" };
    setSelectedEmployee(employeeWithoutPassword);
    console.log("Selected Employee for Edit:", employeeWithoutPassword);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Quản lý nhân viên
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Quản lý thông tin nhân viên
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
          startIcon={<span>+</span>}
          sx={{ borderRadius: 2 }}
        >
          Thêm nhân viên
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Search color="action" sx={{ mr: 1 }} />
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredEmployees.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Họ tên</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Điện thoại</StyledTableCell>
                <StyledTableCell>Vai trò</StyledTableCell>
                <StyledTableCell align="center">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.username}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    {employee.role === "MANAGER" ? "Quản lý" : "Nhân viên"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(employee)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(employee)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy nhân viên nào
          </Typography>
        </Paper>
      )}

      {/* Add Employee Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm nhân viên mới</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={newEmployee.username}
            onChange={(e) =>
              setNewEmployee((prev) => ({ ...prev, username: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            value={newEmployee.password}
            onChange={(e) =>
              setNewEmployee((prev) => ({ ...prev, password: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Họ tên"
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee((prev) => ({ ...prev, name: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Vai trò"
            value={newEmployee.role}
            onChange={(e) =>
              setNewEmployee((prev) => ({ ...prev, role: e.target.value }))
            }
            margin="normal"
          >
            <MenuItem value="EMPLOYEE">Nhân viên</MenuItem>
            <MenuItem value="MANAGER">Quản lý</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Điện thoại"
            value={newEmployee.phone}
            onChange={(e) =>
              setNewEmployee((prev) => ({ ...prev, phone: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee((prev) => ({ ...prev, email: e.target.value }))
            }
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleAddEmployee}
            disabled={
              !newEmployee.username ||
              !newEmployee.password ||
              !newEmployee.name
            }
          >
            Thêm nhân viên
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedEmployee && (
            <>
              <TextField
                fullWidth
                label="Username"
                value={selectedEmployee.username}
                onChange={(e) =>
                  setSelectedEmployee((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Mật khẩu mới (để trống nếu không đổi)"
                type="password"
                value={selectedEmployee.password || ""}
                onChange={(e) =>
                  setSelectedEmployee((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Họ tên"
                value={selectedEmployee.name}
                onChange={(e) =>
                  setSelectedEmployee((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                margin="normal"
                required
              />
              <TextField
                select
                fullWidth
                label="Vai trò"
                value={selectedEmployee.role}
                onChange={(e) =>
                  setSelectedEmployee((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                margin="normal"
              >
                <MenuItem value="EMPLOYEE">Nhân viên</MenuItem>
                <MenuItem value="MANAGER">Quản lý</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Điện thoại"
                value={selectedEmployee.phone}
                onChange={(e) =>
                  setSelectedEmployee((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={selectedEmployee.email}
                onChange={(e) =>
                  setSelectedEmployee((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleEditEmployee}
            disabled={!selectedEmployee?.username || !selectedEmployee?.name}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa nhân viên "{selectedEmployee?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteEmployee}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
