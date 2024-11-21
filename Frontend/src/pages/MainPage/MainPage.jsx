import React, { useState, useEffect } from "react";
import { Button, Card, Col, Image, Rate, Row } from "antd";
import MenuSlide from "../../components/MenuSlide";
import { useNavigate } from "react-router-dom";
import { fetchProductData } from "../../components/Data/api";
import { floatButtonPrefixCls } from "antd/es/float-button/FloatButton";
import "./../styleMainPage.css";
import background_log from "../../assets/images/background_log.png";

const { Meta } = Card;

function MainPage() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductData();
        setItems(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuSelect = (selectedValue) => {
    setSelectedMenu(selectedValue);
    navigate(`/${selectedValue}`);
  };

  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    navigate(`/product-detail/${item.id}`, { state: { item } });
  };

  return (
    <div>
      <div
        className="content"
        style={{
          backgroundImage: `url(${background_log})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "400px",
        }}
      ></div>
      <h3 class="title-comm">
        <span class="title-holder">DANH MỤC SẢN PHẨM</span>
      </h3>
      <Row className="title_bar">
        <Col>
          <MenuSlide onMenuSelect={handleMenuSelect} />
        </Col>
      </Row>
      <div className="card_container">
        {items.map((item) => (
          <Card
            className="card_item"
            key={item.title}
            hoverable
            bodyStyle={{ padding: "10px 24px" }}
            cover={
              <img
                className="mp_book_item_image"
                src={
                  item.picture
                }
                alt={item.title}
              />
            }
            onClick={() => handleCardClick(item)}
          >
            <div className="flex_column">
              <div className="title_start_container">
                <span className="book_title">{item.title}</span>
              </div>
              <span className="book_price">
                {item.price}
                <span
                  style={{
                    verticalAlign: "super",
                    fontSize: "10px",
                    textDecoration: "underline",
                    marginLeft: "2px",
                  }}
                >
                  đ
                </span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
