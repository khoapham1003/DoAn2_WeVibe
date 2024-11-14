import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Col,
  Image,
  InputNumber,
  List,
  Rate,
  Row,
  message,
} from "antd";
import "../stylePage.css";
import { ShoppingCartOutlined } from "@ant-design/icons";

function ProductPage() {
  const location = useLocation();
  const { state } = location;
  const item = state ? state.item : null;
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1);
  const [reviewsdata, setReviewsData] = useState([]);
  const [currentRatingFilter, setCurrentRatingFilter] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchreviewsdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/product/get-details/${item._id}`,
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
        setReviewsData(data);

        return data;
      } catch (error) {
        console.error("Error fetching reviews data:", error);
      }
    };
    fetchreviewsdata();
  }, []);

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
  const jwtToken = getCookie("accessToken");
  const userId = getCookie("userid");

  console.log(item);

  const handleAddToCart = async () => {
    setAmount(1); // Đặt lại số lượng sau khi thêm vào giỏ hàng
    try {
      const data = {
        _id: item._id,
        name: item.name,
        image: item.image,
        amount: amount,
      };
      console.log(data);
      const response = await fetch(
        `http://localhost:3000/user/cart-user/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        // navigate(`/`);
        console.log("Item added to the cart in the database");
        message.success("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        const error = await response.text();
        console.log(error);
        message.error("Vui lòng đăng nhập!");
      }
    } catch (error) {
      message.error("Vui lòng đăng nhập!");
      console.error("Error adding item to the cart:", error);
    }
  };
  function convertNewlinesToBreaks(text) {
    return text.split(",").map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br /> <br />
      </React.Fragment>
    ));
  }
  function ExhibitionContent({ content }) {
    return <div>{convertNewlinesToBreaks(content)}</div>;
  }
  return (
    <div>
      {item && (
        <div>
          <Row className="pp_white_bg">
            <Col md={5} offset={1} className="image_column">
              <Image
                src={
                  item.image == null
                    ? require(`../../assets/user-content/img_default.webp`)
                    : require(`../../assets/user-content/${item.image}`)
                }
                alt={item.name}
              />
            </Col>
            <Col md={14} offset={1} className="shortdetail_column">
              <List className="detail_list">
                <List.Item>
                  <h1>{item.sProduct_name}</h1>
                </List.Item>
                <List.Item>
                  <span className="price">{item.price}đ</span>
                </List.Item>
                <List.Item className="pp_amount">
                  <span>Số lượng:</span>
                  <InputNumber
                    className="amount_box"
                    min={1}
                    value={amount}
                    onChange={setAmount}
                  />
                </List.Item>
                <List.Item>
                  <Button
                    className="addtocart_button"
                    size="large"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCartOutlined />
                    Thêm vào giỏ hàng
                  </Button>
                </List.Item>
              </List>
            </Col>
          </Row>
          <Row className="pp_padding pp_white_bg">
            <Col className="productdetail">
              <List>
                <List.Item>
                  <h2>Mô tả sản phẩm</h2>
                </List.Item>
                <List.Item style={{ fontSize: "16px", color: "#8c8c8c" }}>
                  <ExhibitionContent content={item.description} />
                </List.Item>
              </List>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
