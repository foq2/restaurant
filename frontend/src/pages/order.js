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
  Add as AddIcon,
  ArrowBack,
} from "@mui/icons-material";
import { getOrders, addOrder, updateOrder, deleteOrder } from "../api/order";
import {
  getOrderDetailByOrderId,
  addOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} from "../api/orderDetail";
import { getFoods } from "../api/food";

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
  // Order states
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Order Detail states
  const [viewingOrderDetails, setViewingOrderDetails] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [foods, setFoods] = useState([]);
  const [isAddDetailDialogOpen, setIsAddDetailDialogOpen] = useState(false);
  const [isEditDetailDialogOpen, setIsEditDetailDialogOpen] = useState(false);
  const [isDeleteDetailDialogOpen, setIsDeleteDetailDialogOpen] =
    useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [newOrderDetail, setNewOrderDetail] = useState({
    orderId: "",
    foodId: "",
    quantity: 1,
  });

  // Status options
  const orderStatuses = ["SERVED", "COMPLETED"];

  useEffect(() => {
    fetchOrders();
    fetchFoods();
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

  async function fetchFoods() {
    try {
      const response = await getFoods();
      setFoods(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải danh sách món ăn",
        severity: "error",
      });
    }
  }

  async function fetchOrderDetails(orderId) {
    try {
      setLoadingDetails(true);
      const response = await getOrderDetailByOrderId(orderId);
      setOrderDetails(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải chi tiết đơn hàng",
        severity: "error",
      });
    } finally {
      setLoadingDetails(false);
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
      // Lấy thông tin user từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;

      if (!userId) {
        setAlert({
          open: true,
          message: "Không tìm thấy thông tin người dùng",
          severity: "error",
        });
        return;
      }

      // Tạo order với userId từ user đang đăng nhập và trạng thái mặc định là SERVED
      await addOrder({
        userId: userId,
        description: "", // Để trống mặc định
        status: "SERVED", // Mặc định là SERVED
      });

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
      await updateOrder(selectedOrder.id, {
        description: selectedOrder.description,
        status: selectedOrder.status,
      });
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

  const handleAddOrderDetail = async () => {
    try {
      console.log("Adding order detail:", newOrderDetail);
      await addOrderDetail(newOrderDetail);
      await fetchOrderDetails(currentOrderId);
      setIsAddDetailDialogOpen(false);
      resetOrderDetailForm();
      setAlert({
        open: true,
        message: "Thêm chi tiết đơn hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể thêm chi tiết đơn hàng",
        severity: "error",
      });
    }
  };

  const handleEditOrderDetail = async () => {
    try {
      await updateOrderDetail(
        selectedOrderDetail.id,
        selectedOrderDetail.quantity
      );
      await fetchOrderDetails(currentOrderId);
      setIsEditDetailDialogOpen(false);
      setAlert({
        open: true,
        message: "Cập nhật chi tiết đơn hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể cập nhật chi tiết đơn hàng",
        severity: "error",
      });
    }
  };

  const handleDeleteOrderDetail = async () => {
    try {
      await deleteOrderDetail(selectedOrderDetail.id);
      await fetchOrderDetails(currentOrderId);
      setIsDeleteDetailDialogOpen(false);
      setAlert({
        open: true,
        message: "Xóa chi tiết đơn hàng thành công",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể xóa chi tiết đơn hàng",
        severity: "error",
      });
    }
  };

  const resetOrderDetailForm = () => {
    setNewOrderDetail({
      orderId: currentOrderId,
      foodId: "",
      quantity: 1,
    });
  };

  const openEditDialog = (order) => {
    setSelectedOrder({ ...order });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const openEditDetailDialog = (orderDetail) => {
    setSelectedOrderDetail({ ...orderDetail });
    setIsEditDetailDialogOpen(true);
  };

  const openDeleteDetailDialog = (orderDetail) => {
    setSelectedOrderDetail(orderDetail);
    setIsDeleteDetailDialogOpen(true);
  };

  const viewOrderDetails = async (orderId) => {
    setCurrentOrderId(orderId);
    setViewingOrderDetails(true);
    await fetchOrderDetails(orderId);

    // Pre-fill the new order detail form with the current order ID
    setNewOrderDetail((prev) => ({
      ...prev,
      orderId: orderId,
    }));
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

  const getFoodNameById = (foodId) => {
    const food = foods.find((f) => f.id === foodId);
    return food ? food.name : "Không xác định";
  };

  const getFoodPriceById = (foodId) => {
    const food = foods.find((f) => f.id === foodId);
    return food ? food.price : 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateTotal = () => {
    return orderDetails.reduce((total, detail) => {
      return total + getFoodPriceById(detail.foodId) * detail.quantity;
    }, 0);
  };

  // Main render for Order list
  if (!viewingOrderDetails) {
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
                    <TableCell>
                      {order.user?.name || "Không xác định"}
                    </TableCell>
                    <TableCell>
                      {order.description || "Không có mô tả"}
                    </TableCell>
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
            <Typography>
              Bạn có chắc chắn muốn xóa đơn hàng này không?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteOrder}
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  } else {
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
              Chi tiết đơn hàng
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Xem và quản lý chi tiết đơn hàng
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setViewingOrderDetails(false)}
            startIcon={<ArrowBack />}
            sx={{ borderRadius: 2 }}
          >
            Quay lại danh sách đơn hàng
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Search color="action" sx={{ mr: 1 }} />
            <TextField
              fullWidth
              placeholder="Tìm kiếm theo tên món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Paper>

        {loadingDetails ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : orderDetails.length > 0 ? (
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Tên món ăn</StyledTableCell>
                  <StyledTableCell>Số lượng</StyledTableCell>
                  <StyledTableCell>Giá</StyledTableCell>
                  <StyledTableCell>Thành tiền</StyledTableCell>
                  <StyledTableCell align="center">Thao tác</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetails.map((detail) => (
                  <TableRow key={detail.id} hover>
                    <TableCell>{detail.id}</TableCell>
                    <TableCell>{getFoodNameById(detail.foodId)}</TableCell>
                    <TableCell>{detail.quantity}</TableCell>
                    <TableCell>
                      {formatPrice(getFoodPriceById(detail.foodId))}
                    </TableCell>
                    <TableCell>
                      {formatPrice(
                        getFoodPriceById(detail.foodId) * detail.quantity
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => openEditDetailDialog(detail)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDetailDialog(detail)}
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
              Không tìm thấy chi tiết đơn hàng nào
            </Typography>
          </Paper>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Tổng cộng: {formatPrice(calculateTotal())}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setIsAddDetailDialogOpen(true)}
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2 }}
          >
            Thêm chi tiết đơn hàng
          </Button>
        </Box>

        {/* Add Order Detail Dialog */}
        <Dialog
          open={isAddDetailDialogOpen}
          onClose={() => setIsAddDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Thêm chi tiết đơn hàng</DialogTitle>
          <Divider />
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Món ăn</InputLabel>
              <Select
                value={newOrderDetail.foodId}
                label="Món ăn"
                onChange={(e) =>
                  setNewOrderDetail({
                    ...newOrderDetail,
                    foodId: e.target.value,
                  })
                }
              >
                {foods.map((food) => (
                  <MenuItem key={food.id} value={food.id}>
                    {food.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={newOrderDetail.quantity}
              onChange={(e) =>
                setNewOrderDetail({
                  ...newOrderDetail,
                  quantity: parseInt(e.target.value),
                })
              }
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => {
                setIsAddDetailDialogOpen(false);
                resetOrderDetailForm();
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleAddOrderDetail}
              disabled={!newOrderDetail.foodId || !newOrderDetail.quantity}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Order Detail Dialog */}
        <Dialog
          open={isEditDetailDialogOpen}
          onClose={() => setIsEditDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chỉnh sửa chi tiết đơn hàng</DialogTitle>
          <Divider />
          <DialogContent>
            {selectedOrderDetail && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Món ăn</InputLabel>
                  <Select
                    value={selectedOrderDetail.foodId}
                    label="Món ăn"
                    onChange={(e) =>
                      setSelectedOrderDetail({
                        ...selectedOrderDetail,
                        foodId: e.target.value,
                      })
                    }
                  >
                    {foods.map((food) => (
                      <MenuItem key={food.id} value={food.id}>
                        {food.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Số lượng"
                  type="number"
                  value={selectedOrderDetail.quantity}
                  onChange={(e) =>
                    setSelectedOrderDetail({
                      ...selectedOrderDetail,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  margin="normal"
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => {
                setIsEditDetailDialogOpen(false);
                setSelectedOrderDetail(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="contained" onClick={handleEditOrderDetail}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Order Detail Dialog */}
        <Dialog
          open={isDeleteDetailDialogOpen}
          onClose={() => setIsDeleteDetailDialogOpen(false)}
          maxWidth="xs"
        >
          <DialogTitle>Xóa chi tiết đơn hàng</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa chi tiết đơn hàng này không?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsDeleteDetailDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteOrderDetail}
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
}
