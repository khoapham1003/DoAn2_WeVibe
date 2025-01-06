import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, List, Card, Image, Input, message } from "antd";

function HistoryOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null); // Changed from empty array to null
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const orderId = localStorage.getItem("orderhistoryId");

  const jwtToken = getCookie("accessToken");

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/orders/order-detail/${orderId}`,
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
      console.log(data);
      setOrder(data.data[0]);
      console.log(order);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="title-comm">
        <span className="title-holder">ĐẶT HÀNG</span>
      </h3>
      <div className="cop_container">
        <div className="recipient_info">
          <List
            style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <List.Item>
              <h2>Thông tin người nhận</h2>
            </List.Item>
            {/* Họ, Tên đệm, Tên */}
            <List.Item>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>Họ:</label>
                  <Input
                    name="lastName"
                    value={order.address?.lastName || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Tên đệm:</label>
                  <Input
                    name="middleName"
                    value={order.address?.middleName || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Tên:</label>
                  <Input
                    name="firstName"
                    value={order.address?.firstName || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </List.Item>
            {/* Số điện thoại, Email */}
            <List.Item>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>Số điện thoại:</label>
                  <Input
                    name="phoneNumber"
                    value={order.address?.phone || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Email:</label>
                  <Input
                    name="email"
                    value={order.address?.email || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </List.Item>
            {/* Địa chỉ 1, Địa chỉ 2 */}
            <List.Item>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>Địa chỉ 1:</label>
                  <Input
                    name="line1"
                    value={order.address?.line1 || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Địa chỉ 2 (tùy chọn):</label>
                  <Input
                    name="line2"
                    value={order.address?.line2 || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </List.Item>
            {/* Thành phố, Tỉnh, Quốc gia */}
            <List.Item>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>Thành phố:</label>
                  <Input
                    name="city"
                    value={order.address?.city || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Tỉnh:</label>
                  <Input
                    name="province"
                    value={order.address?.province || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Quốc gia:</label>
                  <Input
                    name="country"
                    value={order.address?.country || ""}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </List.Item>
          </List>
        </div>

        <div className="cop_cartlist_header">
          <Col md={2}></Col>
          <Col md={3} offset={1}>
            <h3>Sản phẩm</h3>
          </Col>
          <Col md={2} offset={1}>
            <h3>Kích thước</h3>
          </Col>
          <Col md={2} offset={1}>
            <h3>Color</h3>
          </Col>
          <Col md={3} offset={1}>
            <h3>Đơn giá</h3>
          </Col>
          <Col md={2}>
            <h3>Số lượng</h3>
          </Col>
          <Col md={3} offset={1}>
            <h3>Thành tiền</h3>
          </Col>
        </div>

        <div className="cop_cartlist_item">
          {order.items?.map((item) => (
            <Card className="cop_item_cart" key={item.id}>
              <Row align="middle">
                <Col md={2}>
                  <Image
                    style={{
                      height: 80,
                      width: 80,
                    }}
                    alt={item.productName}
                    src={item.picture}
                  />
                </Col>
                <Col md={4}>
                  <span>{item.productName}</span>
                </Col>
                <Col md={3}>
                  <span>{item.size} </span>
                </Col>
                <Col md={3}>
                  <span> {item.color}</span>
                </Col>
                <Col md={4}>
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                  </span>
                </Col>
                <Col md={2}>
                  <span>{item.quantity}</span>
                </Col>
                <Col md={4}>
                  <span className="cop_item_price">
                    {new Intl.NumberFormat("vi-VN").format(item.totalPrice)}đ
                  </span>
                </Col>
              </Row>
            </Card>
          ))}
        </div>

        <div className="cop_checkout_info">
          <List>
            <List.Item>
              <h2>Thanh toán</h2>
            </List.Item>
            <List.Item>
              <span>
                Tổng tiền hàng:{" "}
                {new Intl.NumberFormat("vi-VN").format(order.subTotal)}đ
              </span>
            </List.Item>
            <List.Item>
              <span>
                Phí vận chuyển:{" "}
                {new Intl.NumberFormat("vi-VN").format(order.shippingFee)}đ
              </span>
            </List.Item>
            <List.Item>
              <span>
                Tổng giảm giá:{" "}
                {new Intl.NumberFormat("vi-VN").format(order.totalDiscount)}đ
              </span>
            </List.Item>
            <List.Item>
              <span style={{ fontWeight: "500", fontStyle: "italic" }}>
                Tổng thanh toán:{" "}
                {new Intl.NumberFormat("vi-VN").format(order.grandTotal)}đ
              </span>
            </List.Item>
          </List>
        </div>
      </div>
    </div>
  );
}

export default HistoryOrderPage;
