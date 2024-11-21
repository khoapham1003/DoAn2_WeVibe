import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, List, Card, Image, Modal, Input } from "antd";
import { message } from "antd";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState({
    lastName: "L",
    middleName: "L",
    firstName: "L",
    phoneNumber: "0123456789",
    email: "t@gmail.com", //
    line1: "1",
    line2: "1",
    city: "1",
    province: "1",
    country: "1",
  });
  const [promotionalCode, setPromotionalCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(30000);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationPay, setShowConfirmationPay] = useState(false);
  const [isApply, setisApply] = useState(false);
  const [isCheck, setisCheck] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
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
  const orderId = localStorage.getItem("orderId");
  const jwtToken = getCookie("accessToken");
  const userId = getCookie("userid");
  const cartId = getCookie("CartId");

  useEffect(() => {
    const fetchCheckOutData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/order-item/orderdata/${orderId}`,
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
        setItems(data);
        return data;
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchCheckOutData();
  }, []);

  const calculateTotalPrice = () => {
    return items.reduce(
      (total, item) =>
        total + item.productVariant.product.price * item.quantity,
      0
    );
  };

  const calculateTotalDiscount = () => {
    let totalDiscount = 0;
    items.forEach((item) => {
      if (item.productVariant.product.discount > 0) {
        totalDiscount +=
          (item.productVariant.product.price *
            item.quantity *
            item.productVariant.product.discount) /
          100;
      }
    });
    return totalDiscount;
  };

  let totalPrice = calculateTotalPrice();

  const calculateTotalPayment = () => {
    totalPrice *= 1 - voucherDiscount / 100;
    totalPrice += shippingFee;
    totalPrice -= calculateTotalDiscount();
    return totalPrice;
  };

  const handleConfirmPayment = async () => {
    try {
      const data = {
        lastName: order.lastName,
        middleName: order.middleName,
        firstName: order.firstName,
        phoneNumber: order.phoneNumber,
        email: order.email,
        line1: order.line1,
        line2: order.line2,
        city: order.city,
        province: order.province,
        country: order.country,
        status: "PENDING",
        subTotal: totalPrice,
        totalDiscount: calculateTotalDiscount(),
        shippingFee: shippingFee,
        grandTotal: calculateTotalPayment(),
      };
      console.log(data);
      const response = await fetch(
        `http://localhost:3000/orders/${cartId}/${orderId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,

          },
          body: JSON.stringify(data),
        }
      );

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      message.success(`Đặt hàng thành công.`);
      setShowConfirmationPay(false);
      navigate("/");
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const handleApplyVoucher = () => {
    if (isCheck) {
      setShowConfirmation(true);
    } else {
      message.error(`Xin vui lòng xác thực mã giảm giá trước khi áp dụng!`);
    }
  };
  const handleConfirmApplyVoucher = () => {
    setisApply(true);
    setShowConfirmation(false);
  };

  const handleCancelApplyVoucher = () => {
    setShowConfirmation(false);
  };

  const handleCancelPayment = () => {
    setShowConfirmationPay(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  return (
    <div>
      <h3 class="title-comm">
        <span class="title-holder">ĐẶT HÀNG</span>
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
                <Input
                  name="lastName"
                  value={order.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Tên đệm:
                <Input
                  name="middleName"
                  value={order.middleName}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Tên:
                <Input
                  name="firstName"
                  value={order.firstName}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Số điện thoại:
                <Input
                  name="phoneNumber"
                  value={order.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Email:
                <Input
                  name="email"
                  value={order.email}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Địa chỉ 1:
                <Input
                  name="line1"
                  value={order.line1}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Địa chỉ 2 (tùy chọn):
                <Input
                  name="line2"
                  value={order.line2}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Thành phố:
                <Input
                  name="city"
                  value={order.city}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Tỉnh:
                <Input
                  name="province"
                  value={order.province}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Quốc gia:
                <Input
                  name="country"
                  value={order.country}
                  onChange={handleInputChange}
                />
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
          {items.map((item) => (
            <Card className="cop_item_cart" key={item._id}>
              <Row align="middle">
                <Col md={2} offset={1}>
                  <Image
                    style={{
                      height: 80,
                      width: 80,
                    }}
                    alt={item.productVariant.product.title}
                    src={item.productVariant.product.picture}
                  />
                </Col>
                <Col md={8}>
                  <span>{item.productVariant.product.title}</span>
                </Col>
                <Col md={3} offset={1}>
                  <span>{item.productVariant.product.price}đ</span>
                </Col>
                <Col md={3} offset={1}>
                  <span>{item.quantity}</span>
                </Col>
                <Col md={3} offset={1}>
                  <span className="cop_item_price">
                    {item.productVariant.product.price * item.quantity}đ
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
              <span>Tổng tiền hàng: {totalPrice}đ</span>
            </List.Item>
            <List.Item>
              <span>Phí vận chuyển: {shippingFee}đ</span>
            </List.Item>
            <List.Item>
              <span>Tổng giảm giá: {calculateTotalDiscount()}đ</span>
            </List.Item>
            <List.Item>
              <span style={{ fontWeight: "500", fontStyle: "italic" }}>
                Tổng thanh toán: {calculateTotalPayment()}đ
              </span>
            </List.Item>
            <List.Item>
              <Button
                className="cop_button1"
                style={{ width: "150px" }}
                onClick={() => {
                  if (
                    order.firstName &&
                    order.middleName &&
                    order.lastName &&
                    order.line1 &&
                    order.line2 &&
                    order.email &&
                    order.phoneNumber &&
                    order.city &&
                    order.country &&
                    order.province
                  ) {
                    if (order.phoneNumber.length !== 10 || order.phoneNumber[0] !== "0") {
                      message.error(
                        "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0"
                      );
                    } else {
                      if (!promotionalCode) {
                        setShowConfirmationPay(true);
                      } else if (isApply) {
                        setShowConfirmationPay(true);
                      } else {
                        message.error("Vui lòng xác nhận voucher!");
                      }
                    }
                  } else {
                    message.error("Vui lòng nhập đầy đủ thông tin người nhận!");
                  }
                }}
              >
                Thanh toán
              </Button>
            </List.Item>
          </List>
        </div>
      </div>
      {contextHolder}
      <Modal
        visible={showConfirmationPay}
        onOk={handleConfirmPayment}
        onCancel={handleCancelPayment}
      >
        <p>Bạn có chắc muốn thanh toán?</p>
      </Modal>
      <Modal
        visible={showConfirmation}
        onOk={handleConfirmApplyVoucher}
        onCancel={handleCancelApplyVoucher}
      >
        <p>Bạn có chắc muốn áp dụng voucher?</p>
      </Modal>
    </div>
  );
}

export default CheckoutPage;
