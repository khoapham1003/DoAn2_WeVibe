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
          `https://localhost:7139/api/Review/getbyid?iProduct_id=${item.iProduct_id}`,
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
        iProduct_id: item.iProduct_id,
        iProduct_amount: amount,
      };
      console.log(data);
      const response = await fetch(
        `https://localhost:7139/api/Cart/set?gUser_id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);
      if (response.ok) {
        navigate(`/`);
        console.log("Item added to the cart in the database");
        message.success("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        const error = await response.text();
        if (error) {
          message.error(`${error}`);
        }
        console.error("Failed to add item to the cart in the database");
      }
    } catch (error) {
      message.error("Vui lòng đăng nhập!");
      console.error("Error adding item to the cart:", error);
    }
  };

  return (
    <div>
      {item && (
        <div>
          <Row className="pp_white_bg">
            <Col md={5} offset={1} className="image_column">
              <Image
                src={
                  item.sImage_pathThumbnail == null
                    ? require(`../../assets/user-content/img_1.webp`)
                    : require(`../../assets/user-content/${item.sImage_pathThumbnail}`)
                }
                alt={item.sProduct_name}
              />
            </Col>
            <Col md={14} offset={1} className="shortdetail_column">
              <List className="detail_list">
                <List.Item>
                  <h1>{item.sProduct_name}</h1>
                  <span>
                    <br />
                    <br />
                    {item.sProduct_author}
                  </span>
                </List.Item>
                <List.Item className="pp_rate">
                  <span className="green rate_num">
                    {item.dProduct_start_count.toFixed(1)}
                  </span>
                  <Rate
                    className="green rate_star"
                    disabled
                    allowHalf
                    defaultValue={item.dProduct_start_count}
                  />
                </List.Item>
                <List.Item>
                  <span className="price">{item.vProduct_price}đ</span>
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
                  <h2>Thông tin sản phẩm</h2>
                </List.Item>
                <List.Item style={{ fontSize: "15px", color: "#8c8c8c" }}>
                  Xuất Sứ: {item.sProduct_madein}
                </List.Item>
                <List.Item style={{ fontSize: "15px", color: "#8c8c8c" }}>
                  Năm xuất bản: {item.iProduct_yop}
                </List.Item>
                <List.Item style={{ fontSize: "15px", color: "#8c8c8c" }}>
                  Nhà xuất bản: {item.sProduct_brand}
                </List.Item>
                <List.Item style={{ fontSize: "15px", color: "#8c8c8c" }}>
                  Nhà cung cấp: {item.sProduct_supplier}
                </List.Item>
                <List.Item style={{ fontSize: "15px", color: "#8c8c8c" }}>
                  Tác giả: {item.sProduct_author}
                </List.Item>
                <List.Item>
                  <h2>Mô tả sản phẩm</h2>
                </List.Item>
                <List.Item style={{ fontSize: "16px", color: "#8c8c8c" }}>
                  {item.sProduct_description}
                </List.Item>
              </List>
            </Col>
          </Row>
          <Col className="pp_padding pp_white_bg">
            <Row className="review_bar">
              <Row>
                <h2 className="review_title">Đánh giá sản phẩm</h2>
              </Row>
              <Row className="review_proportion">
                <Col>
                  <Row className="rate_proportion">
                    <span className="proportion_myrate green">
                      {item.dProduct_start_count.toFixed(1)}
                    </span>
                    <span className="proportion_allrate green">trên 5</span>
                  </Row>
                  <Row>
                    <Rate
                      className="green"
                      allowHalf
                      disabled
                      defaultValue={item.dProduct_start_count}
                    />
                  </Row>
                </Col>
                <Col className="rate_filter">
                  <Button
                    className="rate_filter_button"
                    onClick={() => setCurrentRatingFilter(null)}
                  >
                    Tất cả
                  </Button>
                  <Button
                    className="rate_filter_button"
                    onClick={() => setCurrentRatingFilter(5)}
                  >
                    5 sao
                  </Button>
                  <Button
                    className="rate_filter_button"
                    onClick={() => setCurrentRatingFilter(4)}
                  >
                    4 sao
                  </Button>
                  <Button
                    className="rate_filter_button"
                    onClick={() => setCurrentRatingFilter(3)}
                  >
                    3 sao
                  </Button>
                  <Button
                    className="rate_filter_button"
                    onClick={() => setCurrentRatingFilter(2)}
                  >
                    2 sao
                  </Button>
                  <Button
                    className="rate_filter_button"
                    onClick={() => setCurrentRatingFilter(1)}
                  >
                    1 sao
                  </Button>
                </Col>
              </Row>
            </Row>
            <Row>
              <List
                className="user_review_list"
                dataSource={reviewsdata.filter((review) =>
                  currentRatingFilter
                    ? review.iReview_start === currentRatingFilter
                    : true
                )}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          className="user_avatar"
                          src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                        />
                      }
                      title={<div>{item.sUser_username}</div>}
                      description={
                        <div className="user_review_description">
                          <Rate
                            className="green"
                            style={{ fontSize: "15px" }}
                            disabled
                            value={item.iReview_start}
                          />
                          <br></br>
                          <span style={{ fontSize: "10px", color: "#8c8c8c" }}>
                            {item.sReview_content}
                          </span>
                          <br></br>
                          <span style={{ fontSize: "10px", color: "#8c8c8c" }}>
                            {item.dtReview_date}
                          </span>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Row>
          </Col>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
