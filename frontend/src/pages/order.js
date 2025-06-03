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
  Divider,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit,
  Delete,
  Search,
  Visibility,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getOrders, addOrder, updateOrder, deleteOrder } from "../api/order";

// Styled components for better UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;

  if (status === "COMPLETED") {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === "SERVED") {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning.light;
  }

  return {
    color: color,
    backgroundColor: backgroundColor,
    fontWeight: "bold",
    borderRadius: "4px",
  };
});

export default function Order() {
  const navigate = useNavigate();

  // Order states
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const newOrder = {
    userId: Number(user.id),
    description: "",
    status: "SERVED", // Default status
  };
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Status options
  const orderStatuses = ["SERVED", "COMPLETED"];

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải danh sách đơn hàng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = async () => {
    try {
      // Tạo order với userId từ user đang đăng nhập và trạng thái mặc định là SERVED
      await addOrder(newOrder);

      await fetchOrders();
      setAlert({
        open: true,
        message: "Thêm đơn hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể thêm đơn hàng",
        severity: "error",
      });
    }
  };

  const handleEditOrder = async () => {
    try {
      const orderToUpdate = {
        description: selectedOrder.description,
        status: selectedOrder.status,
      };
      await updateOrder(selectedOrder.id, orderToUpdate);
      await fetchOrders();
      setIsEditDialogOpen(false);
      setAlert({
        open: true,
        message: "Cập nhật đơn hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể cập nhật đơn hàng",
        severity: "error",
      });
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(selectedOrder.id);
      await fetchOrders();
      setIsDeleteDialogOpen(false);
      setAlert({
        open: true,
        message: "Xóa đơn hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể xóa đơn hàng",
        severity: "error",
      });
    }
  };

  const openEditDialog = (order) => {
    setSelectedOrder({ ...order });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Main render for Order list
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
            Quản lý đơn hàng
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Xem và quản lý các đơn hàng
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddOrder}
          startIcon={<ShoppingCart />}
          sx={{ borderRadius: 2 }}
        >
          Tạo đơn hàng
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Search color="action" sx={{ mr: 1 }} />
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo mô tả, ID, tên nhân viên..."
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
      ) : filteredOrders.length > 0 ? (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Nhân viên</StyledTableCell>
                <StyledTableCell>Mô tả</StyledTableCell>
                <StyledTableCell>Ngày tạo</StyledTableCell>
                <StyledTableCell>Trạng thái</StyledTableCell>
                <StyledTableCell align="center">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.user?.name || "Không xác định"}</TableCell>
                  <TableCell>{order.description || "Không có mô tả"}</TableCell>
                  <TableCell>{formatDate(order.createAt)}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={
                        order.status === "SERVED"
                          ? "Đang phục vụ"
                          : order.status === "COMPLETED"
                          ? "Đã hoàn thành"
                          : order.status
                      }
                      status={order.status}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        color="info"
                        onClick={() => viewOrderDetails(order.id)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialog(order)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(order)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy đơn hàng nào
          </Typography>
        </Paper>
      )}

      {/* Edit Order Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedOrder && (
            <>
              <TextField
                fullWidth
                label="Mô tả"
                value={selectedOrder.description}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    description: e.target.value,
                  })
                }
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={selectedOrder.status}
                  label="Trạng thái"
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      status: e.target.value,
                    })
                  }
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === "SERVED"
                        ? "Đang phục vụ"
                        : status === "COMPLETED"
                        ? "Đã hoàn thành"
                        : status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedOrder(null);
            }}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={handleEditOrder}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Order Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
      >
        <DialogTitle>Xóa đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa đơn hàng này không?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteOrder}>
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
