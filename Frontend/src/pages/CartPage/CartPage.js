import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  InputNumber,
  Checkbox,
  Image,
  message,
  Col,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import "../stylePage.css";

function CartPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };
  const userId = getCookie("userid");
  const jwtToken = getCookie("accessToken");

  const fetchCartData = async () => {
    try {
      if (!userId) {
        console.error("User ID not found in sessionStorage");
        return;
      }

      const response = await fetch(
        `https://localhost:7139/api/Cart/get/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Propagate the error to handle it in the calling code
    }
  };

  const removeCartItem = async (cartItemId) => {
    try {
      if (selectedItems.includes(cartItemId)) {
        // If yes, update selectedItems by removing cartItemId
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((id) => id !== cartItemId)
        );
      }
      const response = await fetch(
        `https://localhost:7139/api/Cart/delete/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchCartData(userId);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  useEffect(() => {
    fetchCartData(userId);
  }, [setItems]);

  const handleCheckout = async () => {
    try {
      const selectedIds = items
        .filter((item) => selectedItems.includes(item.iCart_id))
        .map((item) => item.iCart_id);
      console.log("selectedids:", selectedIds);
      const requestData = {
        lCart_ids: selectedIds,
        gUser_id: userId,
      };

      console.log("Request Data:", requestData);

      const response = await fetch("https://localhost:7139/api/Order", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const orderResponse = await response.json();
      const orderId = orderResponse.iOrder_id;
      localStorage.setItem("orderId", orderId);
      navigate(`/checkout`);
      console.log("Order placed successfully!");
    } catch (error) {
      message.error("Vui lòng chọn sản phẩm bạn muốn thanh toán!");
      console.error("Error placing the order:", error);
    }
  };

  const handleCheckboxChange = (e, itemId) => {
    const { checked } = e.target;
    setSelectedItems((prevSelectedItems) => {
      if (checked) {
        return [...prevSelectedItems, itemId];
      } else {
        return prevSelectedItems.filter((id) => id !== itemId);
      }
    });
  };

  const handleCheckAllChange = () => {
    setSelectedItems((prevSelectedItems) => {
      return prevSelectedItems.length === items.length
        ? []
        : items.map((item) => item.iCart_id);
    });
  };

  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    navigate(`/product-detail/${item.iCart_id}`, { state: { item } });
  };

  const handleQuantityChange = async (itemId, value) => {
    try {
      const response = await fetch(
        `https://localhost:7139/api/Cart/updateamount/${itemId}?amountadd=${value}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchCartData(userId);
    } catch (error) {
      message.error("Không thể đặt thêm sản phẩm này!");
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleRemoveItem = (cartItemId) => {
    removeCartItem(cartItemId);
  };

  const totalAmount = items.reduce(
    (total, item) =>
      selectedItems.includes(item.iCart_id)
        ? total + item.vProduct_price * item.iProduct_amount
        : total,
    0
  );

  const totalQuantity = items.reduce(
    (total, item) =>
      selectedItems.includes(item.iCart_id)
        ? total + item.iProduct_amount
        : total,
    0
  );

  return (
    <div>
      <h3 class="title-comm">
        <span class="title-holder">GIỎ HÀNG</span>
      </h3>

      <div className="cartlist_header">
        <Col md={1}>
          <Checkbox
            checked={items.length === selectedItems.length}
            onChange={handleCheckAllChange}
          ></Checkbox>
        </Col>
        <Col md={2}>
          <h3>Sản phẩm</h3>
        </Col>
        <Col md={8}></Col>
        <Col md={3} offset={1}>
          <h3>Đơn giá</h3>
        </Col>
        <Col md={3}>
          <h3>Số lượng</h3>
        </Col>
        <Col md={3}>
          <h3>Thành tiền</h3>
        </Col>
        <Col md={1}></Col>
      </div>
      <div className="cartlist_item">
        {items.map((item) => (
          <Card className="item_cart" key={item.iCart_id}>
            <Row align="middle">
              <Col md={1}>
                <Checkbox
                  checked={selectedItems.includes(item.iCart_id)}
                  onChange={(e) => handleCheckboxChange(e, item.iCart_id)}
                />
              </Col>
              <Col md={2}>
                <Image
                  style={{
                    height: 80,
                    width: 80,
                  }}
                  src={
                    item.sImage_path == null
                      ? require(`../../assets/user-content/img_1.webp`)
                      : require(`../../assets/user-content/${item.sImage_path}`)
                  }
                  alt={item.sProduct_name}
                />
              </Col>
              <Col md={8}>
                <span>{item.sProduct_name} </span>
              </Col>
              <Col md={3} offset={1}>
                <span> {item.vProduct_price}đ</span>
              </Col>
              <Col md={3}>
                <div className="amount_part">
                  <Button
                    className="amount_change_button"
                    onClick={() => handleQuantityChange(item.iCart_id, +1)}
                  >
                    +
                  </Button>

                  <span style={{ margin: "0px 10px" }}>
                    {item.iProduct_amount}
                  </span>

                  <Button
                    className="amount_change_button"
                    onClick={() => handleQuantityChange(item.iCart_id, -1)}
                    disabled={item.iProduct_amount === 1}
                  >
                    -
                  </Button>
                </div>
              </Col>
              <Col md={3}>
                <span className="cp_item_price">
                  {item.vProduct_price * item.iProduct_amount}đ
                </span>
              </Col>
              <Col md={1}>
                <Button
                  className="cp_delete_button"
                  onClick={() => handleRemoveItem(item.iCart_id)}
                >
                  Xóa
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
      <div className="order_info_cover">
        <List>
          <List.Item>
            <h2>Thanh toán</h2>
          </List.Item>
          <List.Item>
            <span>Tổng số lượng: {totalQuantity}</span>
          </List.Item>
          <List.Item>
            <span>Tổng thanh toán: {totalAmount}đ</span>
          </List.Item>

          <List.Item>
            <Button
              size="large"
              className="cart_button"
              onClick={handleCheckout}
            >
              Mua Hàng
            </Button>
          </List.Item>
        </List>
      </div>
    </div>
  );
}

export default CartPage;
