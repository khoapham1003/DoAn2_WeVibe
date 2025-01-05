import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, Col, Row, Pagination, Rate, Select } from "antd";
import { useNavigate } from "react-router-dom";
import MenuSlide from "../../components/MenuSlide";

const { Meta } = Card;
const { Option } = Select;

const FilteredPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const initialSelectedMenu = pathName.substring(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0,
  });
  const [selectedMenu, setSelectedMenu] = useState(initialSelectedMenu);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:3000/product/category/${selectedMenu}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMenu, pagination.current, pagination.pageSize]);

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

  const handleMenuSelect = (selectedValue) => {
    setSelectedMenu(selectedValue);
    navigate(`/${selectedValue}`);
    window.location.reload();
  };

  const handleProductClick = (item) => {
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
      <h3 class="title-comm">
        <span class="title-holder">SẢN PHẨM CÙNG THỂ LOẠI</span>
      </h3>
      <Row className="title_bar">
        <Col>
          <MenuSlide onMenuSelect={handleMenuSelect} />
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
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <Card
              className="card_item"
              key={item.id}
              hoverable
              bodyStyle={{ padding: "10px 24px" }}
              cover={
                <img
                  className="mp_product_item_image"
                  alt={item.title}
                  src={item.picture}
                />
              }
              onClick={() => handleProductClick(item)}
            >
              <div className="flex_column">
                <div className="title_start_container">
                  <span className="product_title">{item.title}</span>
                  {/* <Rate
                    disabled
                    className="product_star"
                    defaultValue={item.dProduct_start_count}
                  /> */}
                </div>
                <span className="product_price">
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
          ))
        ) : (
          <p>No items available.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredPage;
