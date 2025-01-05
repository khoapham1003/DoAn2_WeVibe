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
          <List>
            <List.Item>
              <h2>Thông tin người nhận</h2>
            </List.Item>
            <List.Item>
              <div>
                Họ:
                <Input name="lastName" value={order.address?.lastName || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Tên đệm:
                <Input
                  name="middleName"
                  value={order.address?.middleName || ""}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Tên:
                <Input
                  name="firstName"
                  value={order.address?.firstName || ""}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Số điện thoại:
                <Input name="phoneNumber" value={order.address?.phone || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Email:
                <Input name="email" value={order.address?.email || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Địa chỉ 1:
                <Input name="line1" value={order.address?.line1 || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Địa chỉ 2 (tùy chọn):
                <Input name="line2" value={order.address?.line2 || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Thành phố:
                <Input name="city" value={order.address?.city || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Tỉnh:
                <Input name="province" value={order.address?.province || ""} />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Quốc gia:
                <Input name="country" value={order.address?.country || ""} />
              </div>
            </List.Item>
          </List>
        </div>

        <div className="cop_cartlist_header">
          <Col md={2} offset={1}>
            <h3>Sản phẩm</h3>
          </Col>
          <Col md={8}></Col>
          <Col md={3} offset={1}>
            <h3>Đơn giá</h3>
          </Col>
          <Col md={3} offset={1}>
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
                <Col md={2} offset={1}>
                  <Image
                    style={{
                      height: 80,
                      width: 80,
                    }}
                    alt={item.productName}
                    src={item.picture}
                  />
                </Col>
                <Col md={8}>
                  <span>{item.productName}</span>
                </Col>
                <Col md={3}>
                  <span>{item.size} </span>
                </Col>
                <Col md={3} offset={1}>
                  <span> {item.color}</span>
                </Col>
                <Col md={3} offset={1}>
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                  </span>
                </Col>
                <Col md={3} offset={1}>
                  <span>{item.quantity}</span>
                </Col>
                <Col md={3} offset={1}>
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
