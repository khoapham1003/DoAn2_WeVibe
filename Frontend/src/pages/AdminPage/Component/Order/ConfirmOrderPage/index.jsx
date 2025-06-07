import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, List, Card, Image, Input, message, Descriptions, Tag } from "antd";

function ConfirmOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState([]);
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

  const orderId = localStorage.getItem("orderconfirmId");

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
      console.log(response);
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

  const handleConfirmOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/orders/confirm-order/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            status: "COMPLETED",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error confirming the order");
      }

      const result = await response.json();
      message.success("Xác nhận đơn hàng thành công!");
      await setShowConfirmation(true);
      navigate("/admin");
    } catch (error) {
      console.error("Error confirming the order:", error);
      message.error("Có lỗi trong quá trình xác nhận đơn hàng.");
    }
  };

  const transaction = order?.orderBlockchain?.[0];

   let payment = null;

  if (transaction) {
    payment = JSON.parse(transaction.paymentDetails); 
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
            <h3>Kích Thước</h3>
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
                  {new Intl.NumberFormat("vi-VN").format(item.price)}đ
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
               Tổng tiền sản phẩm:  {" "}
              <span>
                {new Intl.NumberFormat("vi-VN").format(order.subTotal)} đ
              </span>
            </List.Item>
            <List.Item>
              Phí Shipping:{" "}
              <span>
                {new Intl.NumberFormat("vi-VN").format(order.shippingFee)} đ
              </span>
            </List.Item>
            <List.Item>
              Tổng tiền giảm giá: {" "}
              <span>
                {new Intl.NumberFormat("vi-VN").format(order.totalDiscount)} đ
              </span>
            </List.Item>
            <List.Item>
              <span style={{ fontWeight: "500", fontStyle: "italic" }}>
                Tổng thanh toán:
                {new Intl.NumberFormat("vi-VN").format(order.grandTotal)} đ
              </span>
            </List.Item>
            <List.Item>
              <Button
                className="profilepage_button"
                onClick={() => {
                  handleConfirmOrder();
                }}
                disabled={order.status === "COMPLETED"}
              >
                Xác Nhận Đơn Hàng
              </Button>
            </List.Item>
          </List>
        </div>
        {transaction && (
          <Card
            title={`Giao dịch Blockchain - Đơn hàng #${transaction.orderID}`}
            bordered={false}
          >
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Mã giao dịch">{transaction.id}</Descriptions.Item>
              <Descriptions.Item label="Số tiền">{transaction.amount} TOKEN</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={transaction.status === 'SUCCESS' ? 'green' : 'red'}>
                  {transaction.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {transaction.paymentMethodType}
              </Descriptions.Item>
              <Descriptions.Item label="Từ ví">{payment.from}</Descriptions.Item>
              <Descriptions.Item label="Đến ví">{payment.to}</Descriptions.Item>
              <Descriptions.Item label="Tx Hash">{payment.hash}</Descriptions.Item>
              <Descriptions.Item label="Gas Limit">{payment.gasLimit}</Descriptions.Item>
              <Descriptions.Item label="Gas Price">{payment.gasPrice}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(transaction.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ConfirmOrderPage;
