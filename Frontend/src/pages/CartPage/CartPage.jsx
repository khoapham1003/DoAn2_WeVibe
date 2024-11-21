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
  const cartId = getCookie("CartId");

  const fetchCartData = async () => {
    try {
      if (!userId) {
        console.error("User ID not found in sessionStorage");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/cartitem/get-cart-data/${cartId}`,
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
      console.log(data);
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
        `http://localhost:3000/cartitem/delete-cartitem/${cartItemId}`,
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
      const requestData = {
        userId: userId,
        subTotal: totalAmount,
        totalDiscount: totalDiscount,
      };

      const response = await fetch(
        `http://localhost:3000/orders/create-order/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const orderResponse = await response.json();
      const orderId = orderResponse.id;

      localStorage.setItem("orderId", orderId);
      handleCheckoutItems(orderId);
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

  const handleCheckoutItems = async (orderId) => {
    try {
      const selectedVIds = items.map((item) => item.productVID);
      const selectedPrices = items.map(
        (item) => item.productVariant.product.price
      );
      const selectedDiscount = items.map(
        (item) => item.productVariant.product.discount
      );
      const selectQuantity = items.map((item) => item.quantity);
      const requestData = selectedVIds.map((productVID, index) => ({
        orderID: orderId,            // Use the same orderId for each item
        productVID: productVID,
        price: selectedPrices[index],
        discount: selectedDiscount[index],
        quantity: selectQuantity[index]
      }));
      console.log(requestData);
      const response = await fetch(
        `http://localhost:3000/order-item/create-orderitems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);
    } catch {
      message.error("1234566778");
      return;
    }
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
      const requestData = {
        quantity: value,
      };
      console.log("Request Data:", requestData);
      const response = await fetch(
        `http://localhost:3000/cartitem/update-cartitem/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestData),
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
        ? total + item.productVariant.product.price * item.quantity
        : total,
    0
  );

  const totalQuantity = items.reduce(
    (total, item) =>
      selectedItems.includes(item.id) ? total + item.quantity : total,
    0
  );

  const totalDiscount = items.reduce(
    (total, item) =>
      selectedItems.includes(item.id)
        ? total +
          item.productVariant.product.price *
            item.quantity *
            item.productVariant.product.discount
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
                  src={item.productVariant.product.picture}
                  alt={item.title}
                />
              </Col>
              <Col md={8}>
                <span>{item.productVariant.product.title} </span>
              </Col>
              <Col md={3} offset={1}>
                <span> {item.productVariant.product.price}đ</span>
              </Col>
              <Col md={3}>
                <div className="amount_part">
                  <Button
                    className="amount_change_button"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>

                  <span style={{ margin: "0px 10px" }}>{item.quantity}</span>

                  <Button
                    className="amount_change_button"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity === 1}
                  >
                    -
                  </Button>
                </div>
              </Col>
              <Col md={3}>
                <span className="cp_item_price">
                  {item.productVariant.product.price * item.quantity}đ
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
