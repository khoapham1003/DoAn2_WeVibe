import React, { useEffect, useState } from "react";
import { Card, Col, Rate, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import MenuSlide from "../../components/MenuSlide";
import background_log from "../../assets/images/background_log.png";

const { Option } = Select;

const SearchPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchValue = localStorage.getItem("datasearch");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.key === "F5") {
        event.preventDefault();
        window.location.href = "/"; // Điều hướng về trang chủ và reload
      }
    };

    // Thêm sự kiện keydown
    window.addEventListener("keydown", handleRefresh);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener("keydown", handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (sortOrder) {
      const sortedItems = [...items];
      if (sortOrder === "price-asc") {
        sortedItems.sort((a, b) => a.price - b.price);
      } else if (sortOrder === "price-desc") {
        sortedItems.sort((a, b) => b.price - a.price);
      } else if (sortOrder === "name-asc") {
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOrder === "name-desc") {
        sortedItems.sort((a, b) => b.title.localeCompare(a.title));
      }
      setItems(sortedItems); // Cập nhật lại mảng items đã sắp xếp
    }
  }, [sortOrder, items]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const datareq = {
          keyword: searchValue,
        };
        const response = await fetch(
          `http://localhost:3000/product/search-product/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datareq),
          }
        );
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        setItems(data.data);
      } catch (error) {
        console.error("API Error:", error);
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

  const handleSortChange = (value) => {
    if (sortOrder) {
      const sortedItems = [...items];
      if (sortOrder === "price-asc") {
        sortedItems.sort((a, b) => a.price - b.price);
      } else if (sortOrder === "price-desc") {
        sortedItems.sort((a, b) => b.price - a.price);
      } else if (sortOrder === "name-asc") {
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOrder === "name-desc") {
        sortedItems.sort((a, b) => b.title.localeCompare(a.title));
      }
      setItems(sortedItems);
    }
    setSortOrder(value);
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
          <MenuSlide size="large" onMenuSelect={handleMenuSelect} />
        </Col>
      </Row>
      <div className="sort-container">
        <Select
          defaultValue="price-asc"
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Option value="price-asc">Sắp xếp theo giá (tăng dần)</Option>
          <Option value="price-desc">Sắp xếp theo giá (giảm dần)</Option>
          <Option value="name-asc">Sắp xếp theo tên (A-Z)</Option>
          <Option value="name-desc">Sắp xếp theo tên (Z-A)</Option>
        </Select>
      </div>
      <div className="card_container">
        {items.map((item) => (
          <Card
            className="card_item"
            key={item.title}
            hoverable
            bodyStyle={{ padding: "10px 24px" }}
            cover={
              <img
                className="mp_product_item_image"
                src={item.picture}
                alt={item.title}
              />
            }
            onClick={() => handleCardClick(item)}
          >
            <div className="flex_column">
              <div className="title_start_container">
                <span className="product_title">{item.title}</span>
              </div>
              <span className="product_price">
                {new Intl.NumberFormat("vi-VN").format(item.price)}
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
};
export default SearchPage;
