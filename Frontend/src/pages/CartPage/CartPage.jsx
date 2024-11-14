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
        `http://localhost:3000/user/get-cart-user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data.products);
      console.log(items);
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
        `http://localhost:3000/user/delete-cart-user/${userId}/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
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
      const selectedItemsData = items
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => ({
          _id: item.id,
          amount: item.amount,
        }));

      const requestData = {
        selectedItems: selectedItemsData,
      };

      console.log("Request Data:", requestData);

      const response = await fetch(
        `http://localhost:3000/order/check-out/${userId}`,
        {
          method: "POST",
          headers: {
            token: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const orderResponse = await response.json();
      console.log("Response:", orderResponse);

      const orderId = orderResponse._id;
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
        : items.map((item) => item.id);
    });
  };

  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    navigate(`/product-detail/${item.id}`, { state: { item } });
  };

  const handleQuantityChange = async (itemId, value) => {
    try {
      if (selectedItems.includes(itemId)) {
        // If yes, update selectedItems by removing cartItemId
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((id) => id !== itemId)
        );
      }
      const data = {
        amount: value,
      };
      const response = await fetch(
        `http://localhost:3000/user/update-cart-user/${userId}/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
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
      selectedItems.includes(item.id)
        ? total + item.price * item.amount
        : total,
    0
  );

  const totalQuantity = items.reduce(
    (total, item) =>
      selectedItems.includes(item.id) ? total + item.amount : total,
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
          <Card className="item_cart" key={item.id}>
            <Row align="middle">
              <Col md={1}>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => handleCheckboxChange(e, item.id)}
                />
              </Col>
              <Col md={2}>
                <Image
                  style={{
                    height: 80,
                    width: 80,
                  }}
                  alt={item.name}
                  src={item.image}
                />
              </Col>
              <Col md={8}>
                <span>{item.name} </span>
              </Col>
              <Col md={3} offset={1}>
                <span> {item.price}đ</span>
              </Col>
              <Col md={3}>
                <div className="amount_part">
                  <Button
                    className="amount_change_button"
                    onClick={() =>
                      handleQuantityChange(item.id, item.amount + 1)
                    }
                  >
                    +
                  </Button>

                  <span style={{ margin: "0px 10px" }}>{item.amount}</span>

                  <Button
                    className="amount_change_button"
                    onClick={() =>
                      handleQuantityChange(item.id, item.amount - 1)
                    }
                    disabled={item.amount === 1}
                  >
                    -
                  </Button>
                </div>
              </Col>
              <Col md={3}>
                <span className="cp_item_price">
                  {item.price * item.amount}đ
                </span>
              </Col>
              <Col md={1}>
                <Button
                  className="cp_delete_button"
                  onClick={() => handleRemoveItem(item.id)}
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
