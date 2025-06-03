import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit, Delete, Search, Fastfood } from "@mui/icons-material";
import { getFoods, addFood, updateFood, deleteFood } from "../api/food";

// Styled components for better UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

export default function Food() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newFood, setNewFood] = useState({
    name: "",
    price: 0,
    description: "",
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  async function fetchFoods() {
    try {
      setLoading(true);
      const response = await getFoods();
      setFoods(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải danh sách món ăn",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredFoods = foods.filter(
    (food) =>
      food.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFood = async () => {
    try {
      await addFood(newFood);
      await fetchFoods();
      setIsAddDialogOpen(false);
      resetForm();
      setAlert({
        open: true,
        message: "Thêm món ăn thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể thêm món ăn",
        severity: "error",
      });
    }
  };

  const handleEditFood = async () => {
    try {
      await updateFood(selectedFood.id, selectedFood);
      await fetchFoods();
      setIsEditDialogOpen(false);
      setAlert({
        open: true,
        message: "Cập nhật món ăn thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể cập nhật món ăn",
        severity: "error",
      });
    }
  };

  const handleDeleteFood = async () => {
    try {
      await deleteFood(selectedFood.id);
      await fetchFoods();
      setIsDeleteDialogOpen(false);
      setAlert({
        open: true,
        message: "Xóa món ăn thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể xóa món ăn",
        severity: "error",
      });
    }
  };

  const resetForm = () => {
    setNewFood({
      name: "",
      price: 0,
      description: "",
    });
  };

  const openEditDialog = (food) => {
    setSelectedFood({ ...food });
    console.log("Selected food for edit:", selectedFood);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (food) => {
    setSelectedFood(food);
    setIsDeleteDialogOpen(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
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
            Quản lý món ăn
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Thêm, sửa, xóa các món ăn trong thực đơn
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setIsAddDialogOpen(true)}
          startIcon={<Fastfood />}
          sx={{ borderRadius: 2 }}
        >
          Thêm món ăn
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Search color="action" sx={{ mr: 1 }} />
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên, mô tả..."
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
      ) : filteredFoods.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Tên món</StyledTableCell>
                <StyledTableCell>Giá</StyledTableCell>
                <StyledTableCell>Mô tả</StyledTableCell>
                <StyledTableCell align="center">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFoods.map((food) => (
                <TableRow key={food.id} hover>
                  <TableCell>{food.name}</TableCell>
                  <TableCell>{formatPrice(food.price)}</TableCell>
                  <TableCell>{food.description}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => openEditDialog(food)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => openDeleteDialog(food)}
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
            Không tìm thấy món ăn nào
          </Typography>
        </Paper>
      )}

      {/* Add Food Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm món ăn mới</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            fullWidth
            label="Tên món"
            value={newFood.name}
            onChange={(e) =>
              setNewFood((prev) => ({ ...prev, name: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Giá"
            type="number"
            value={newFood.price}
            onChange={(e) =>
              setNewFood((prev) => ({ ...prev, price: Number(e.target.value) }))
            }
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">VND</InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Mô tả"
            value={newFood.description}
            onChange={(e) =>
              setNewFood((prev) => ({ ...prev, description: e.target.value }))
            }
            margin="normal"
            multiline
            rows={3}
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
            onClick={handleAddFood}
            disabled={!newFood.name || newFood.price <= 0}
          >
            Thêm món ăn
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Food Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedFood && (
            <>
              <TextField
                fullWidth
                label="Tên món"
                value={selectedFood.name}
                onChange={(e) =>
                  setSelectedFood((prev) => ({ ...prev, name: e.target.value }))
                }
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Giá"
                type="number"
                value={selectedFood.price}
                onChange={(e) =>
                  setSelectedFood((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">VND</InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Mô tả"
                value={selectedFood.description || ""}
                onChange={(e) =>
                  setSelectedFood((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                margin="normal"
                multiline
                rows={3}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleEditFood}
            disabled={!selectedFood?.name || selectedFood?.price <= 0}
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
            Bạn có chắc chắn muốn xóa món "{selectedFood?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteFood}>
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
