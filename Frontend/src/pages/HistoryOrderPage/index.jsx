import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, List, Card, Image, Modal, Input, Rate } from "antd";
import { message } from "antd";

const { TextArea } = Input;

function HistoryOrderPage() {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [shippingFee, setShippingFee] = useState(30000);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewData, setReviewData] = useState({
    iReview_start: 1,
    sReview_content: "",
  });
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

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
    const fetchCheckOutData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/order/get-details-order/${orderId}`,
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
        setItems(data.data.orderItems);
        setOrder(data.data.shippingAddress);
        return data;
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchCheckOutData();
  }, []);

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.amount, 0);
  };

  let totalPrice = calculateTotalPrice();

  const handleReviewClick = (index) => {
    setReviewModalVisible(true);
    setSelectedItemIndex(index);
  };

  const handleReviewSubmit = async () => {
    try {
      if (selectedItemIndex !== null) {
        const selectedProduct = items[selectedItemIndex];
        const requestBody = {
          iOrder_id: order.iOrder_id,
          lReview_products: [
            {
              id: selectedProduct.id,
              iReview_start: reviewData.iReview_start,
              sReview_content: reviewData.sReview_content,
            },
          ],
        };
        console.log(`requestdata`, requestBody);
        const response = await fetch("https://localhost:3000/api/Review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const error = await response.text();
          if (error) {
            message.error(`${error}`);
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        message.success("Review submitted successfully");
        setReviewModalVisible(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Error submitting review");
    }
  };

  return (
    <div>
      <h3 class="title-comm">
        <span class="title-holder">ĐƠN HÀNG ĐÃ MUA</span>
      </h3>
      <div className="ho_container">
        <div className="recipient_info">
          <List>
            <List.Item>
              <h2>Thông tin người nhận</h2>
            </List.Item>
            <List.Item>Tên người dùng: {order.fullName}</List.Item>
            <List.Item>Phone: {order.phone}</List.Item>
            <List.Item>Địa chỉ: {order.address}</List.Item>
          </List>
        </div>
        <div className="ho_cartlist_header">
          <Col md={2} offset={1}>
            <h3>Sản phẩm</h3>
          </Col>
          <Col md={8}></Col>
          <Col md={2} offset={1}>
            <h3>Đơn giá</h3>
          </Col>
          <Col md={2} offset={1}>
            <h3>Số lượng</h3>
          </Col>
          <Col md={2} offset={1}>
            <h3>Thành tiền</h3>
          </Col>
        </div>
        <div className="ho_cartlist_item">
          {items.map((item, index) => (
            <Card className="ho_item_cart">
              <Row align="middle">
                <Col md={2} offset={1}>
                  <Image
                    style={{
                      height: 80,
                      width: 80,
                    }}
                    src={item.image}
                    alt={item.name}
                  />
                </Col>
                <Col md={8}>
                  <span>{item.name}</span>
                </Col>
                <Col md={2} offset={1}>
                  <span>{item.price}đ</span>
                </Col>
                <Col md={2} offset={1}>
                  <span>{item.amount}</span>
                </Col>
                <Col md={2} offset={1}>
                  <span className="ho_item_price">
                    {item.price * item.amount}đ
                  </span>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
        <div className="ho_checkout_info">
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
                Tổng thanh toán: {totalPrice + shippingFee} đ
              </span>
            </List.Item>
          </List>
        </div>
      </div>

      <Modal
        title="Đánh giá sản phẩm"
        visible={isReviewModalVisible}
        onOk={handleReviewSubmit}
        onCancel={() => setReviewModalVisible(false)}
      >
        <p>Đánh giá sao:</p>
        <Rate
          value={reviewData.iReview_start}
          onChange={(value) =>
            setReviewData({ ...reviewData, iReview_start: value })
          }
          min={1}
        />
        <p>Nội dung đánh giá:</p>
        <TextArea
          rows={4}
          value={reviewData.sReview_content}
          onChange={(e) =>
            setReviewData({
              ...reviewData,
              sReview_content: e.target.value,
            })
          }
        />
      </Modal>
    </div>
  );
}

export default HistoryOrderPage;
