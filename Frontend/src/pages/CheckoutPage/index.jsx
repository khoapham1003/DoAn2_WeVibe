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
  const [order, setOrder] = useState([]);
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

  useEffect(() => {
    const fetchCheckOutData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7139/api/Order/${orderId}`,
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
        setItems(data.lOrder_items);
        setOrder(data);
        return data;
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchCheckOutData();
  }, []);

  const handleCheckVoucher = async () => {
    try {
      const apiUrl = `https://localhost:7139/api/PromotionalCode/checkcode?sPromotionalCode_code=${promotionalCode}&gUser_id=${userId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        try {
          const responseBody = await response.clone().text();
          const errorResponse = JSON.parse(responseBody);
          if (
            response.status === 400 &&
            errorResponse.errors &&
            errorResponse.errors.sPromotionalCode_code
          ) {
            message.error("Hãy nhập vào mã giảm giá");
          } else {
            const error = await response.text();
            message.error(`Xác thực mã không thành công: ${error}`);
          }
        } catch (parseError) {
          const error = await response.text();
          message.error(`${error}`);
        }
        setVoucherDiscount(0);
      } else {
        const data = await response.json();
        console.log(data);
        setVoucherDiscount(data.iPromotionalCode_discount_rate);
        message.success("Áp dụng mã giảm giá thành công!");
        console.log(voucherDiscount);
        setisCheck(true);
      }
    } catch (error) {
      message.error("Mã giảm giá không tồn tại!");
      console.error("Cannot check voucher:", error);
    }
  };

  const calculateTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.vProduct_price * item.iProduct_amount,
      0
    );
  };

  let totalPrice = calculateTotalPrice();

  const calculateTotalPayment = () => {
    totalPrice *= 1 - voucherDiscount / 100;
    totalPrice += shippingFee;
    return totalPrice;
  };

  const handleConfirmPayment = async () => {
    try {
      const data = {
        iOrder_id: orderId,
        sOrder_name_receiver: order.sOrder_name_receiver,
        sOrder_phone_receiver: order.sOrder_phone_receiver,
        sOrder_address_receiver: order.sOrder_address_receiver,
        sPromotionalCode_code: promotionalCode,
      };
      console.log(data);
      const response = await fetch("https://localhost:7139/api/Order/buy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      });

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
                Tên người dùng:
                <Input
                  name="sOrder_name_receiver"
                  value={order.sOrder_name_receiver}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Phone:{" "}
                <Input
                  name="sOrder_phone_receiver"
                  value={order.sOrder_phone_receiver}
                  onChange={handleInputChange}
                />
              </div>
            </List.Item>
            <List.Item>
              <div>
                Địa chỉ:{" "}
                <Input
                  name="sOrder_address_receiver"
                  value={order.sOrder_address_receiver}
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
            <Card className="cop_item_cart" key={item.iCart_id}>
              <Row align="middle">
                <Col md={2} offset={1}>
                  <Image
                    style={{
                      height: 80,
                      width: 80,
                    }}
                    src={
                      item.sImage_path == null
                        ? require(`../../assets/user-content/img_default.webp`)
                        : require(`../../assets/user-content/${item.sImage_path}`)
                    }
                    alt={item.sProduct_name}
                  />
                </Col>
                <Col md={8}>
                  <span>{item.sProduct_name}</span>
                </Col>
                <Col md={3} offset={1}>
                  <span>{item.vProduct_price}đ</span>
                </Col>
                <Col md={3} offset={1}>
                  <span>{item.iProduct_amount}</span>
                </Col>
                <Col md={3} offset={1}>
                  <span className="cop_item_price">
                    {item.vProduct_price * item.iProduct_amount}đ
                  </span>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
        <div className="cop_voucher">
          <List>
            <List.Item>
              <h2>Voucher</h2>
            </List.Item>
            <List.Item>
              <Input
                value={promotionalCode}
                onChange={(e) => {
                  setPromotionalCode(e.target.value);
                  setisCheck(false);
                }}
                disabled={isApply}
              />
            </List.Item>
            <List.Item
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <Button
                className="cop_button1"
                onClick={handleCheckVoucher}
                disabled={isApply}
                style={{ width: "120px" }}
              >
                Check Code
              </Button>
              <Button
                className="cop_button2"
                onClick={handleApplyVoucher}
                disabled={isApply}
                style={{ width: "120px" }}
              >
                Áp dụng
              </Button>
            </List.Item>
          </List>
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
                    order.sOrder_name_receiver &&
                    order.sOrder_phone_receiver &&
                    order.sOrder_address_receiver
                  ) {
                    if (
                      order.sOrder_phone_receiver.length !== 10 ||
                      order.sOrder_phone_receiver[0] !== "0"
                    ) {
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
