import React, { useEffect, useState, useCallback } from "react";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Edit,
  Delete,
  Search,
  Add as AddIcon,
  ArrowBack,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderDetailByOrderId,
  addOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} from "../api/orderDetail";
import { getOrder } from "../api/order";
import { getFoods } from "../api/food";

// Styled components for better UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Order states
  const [order, setOrder] = useState(null);

  // Order Detail states
  const [searchTerm, setSearchTerm] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [foods, setFoods] = useState([]);
  const [isAddDetailDialogOpen, setIsAddDetailDialogOpen] = useState(false);
  const [isEditDetailDialogOpen, setIsEditDetailDialogOpen] = useState(false);
  const [isDeleteDetailDialogOpen, setIsDeleteDetailDialogOpen] =
    useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [newOrderDetail, setNewOrderDetail] = useState({
    orderId: Number(orderId),
    foodId: 0,
    quantity: 1,
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchOrder = useCallback(async () => {
    try {
      const response = await getOrder(orderId);
      setOrder(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: "Không thể tải thông tin đơn hàng",
        severity: "error",
      });
    }
  }, [orderId]);

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

  const fetchOrderDetails = useCallback(async () => {
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
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
    fetchOrder();
    fetchFoods();
  }, [fetchOrder, fetchOrderDetails, orderId]);

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
  const filteredOrderDetails = orderDetails.filter((detail) => {
    const foodName = getFoodNameById(detail.foodId);
    return foodName.includes(searchTerm.toLowerCase());
  });

  const handleAddOrderDetail = async () => {
    try {
      await addOrderDetail(newOrderDetail);
      await fetchOrderDetails();
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
      await updateOrderDetail(selectedOrderDetail.id, {
        quantity: selectedOrderDetail.quantity,
      });
      await fetchOrderDetails();
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
      await fetchOrderDetails();
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
      orderId: Number(orderId),
      foodId: 0,
      quantity: 1,
    });
  };

  const openEditDetailDialog = (orderDetail) => {
    setSelectedOrderDetail({ ...orderDetail });
    setIsEditDetailDialogOpen(true);
  };

  const openDeleteDetailDialog = (orderDetail) => {
    setSelectedOrderDetail(orderDetail);
    setIsDeleteDetailDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
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
            Chi tiết đơn hàng #{orderId}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {order && (
              <>
                Nhân viên: {order.user?.name || "Không xác định"} | Ngày tạo:{" "}
                {formatDate(order.createAt)} | Trạng thái:{" "}
                {order.status === "SERVED" ? "Đã phục vụ" : "Đã hoàn thành"}
              </>
            )}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/order")}
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
      ) : filteredOrderDetails.length > 0 ? (
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
              {filteredOrderDetails.map((detail) => (
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
                  {food.name} - {formatPrice(food.price)}
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
            inputProps={{ min: 1 }}
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
              <Typography variant="subtitle1" gutterBottom>
                Món ăn: {getFoodNameById(selectedOrderDetail.foodId)}
              </Typography>
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
                inputProps={{ min: 1 }}
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
