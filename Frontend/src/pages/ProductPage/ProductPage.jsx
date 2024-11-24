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
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [productvariant, setProductVariant] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null); 
  const [selectedSize, setSelectedSize] = useState(null); 
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchreviewsdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/product/get-product/${item.id}`,
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
    const fetchproductvariant = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/product-variants/get-by-productId/${item.id}`,
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
        setProductVariant(data);

          const tempColors = [];
          const tempSizes = [];
  
          data.forEach((item) => {
            if (item.color && !tempColors.some((color) => color.id === item.color.id)) {
              tempColors.push(item.color); // Thêm màu sắc duy nhất
            }
            if (item.size && !tempSizes.some((size) => size.size === item.size.size)) {
              tempSizes.push(item.size); // Thêm kích thước duy nhất
            }
          });
  
          setColor(tempColors);
          setSize(tempSizes);
        
          console.log("clort",color,size);



        return data;
      } catch (error) {
        console.error("Error fetching product variant:", error);
      }
    };
    fetchreviewsdata();
    fetchproductvariant();
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
  const cartId = getCookie("CartId");
  const handleAddToCart = async () => {
    setAmount(1); // Đặt lại số lượng sau khi thêm vào giỏ hàng
    try {
      const data = {
        colorId: selectedColor.id,
        sizeId: selectedSize.id,
        productId: item.id,
        quantity: amount,
        cartID: Number(cartId),
        price: item.price,
        discount: item.discount,
      };
      console.log("34tyui", data);
      const response = await fetch(
        `http://localhost:3000/cartitem/create-cart-item`,
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
          message.error("Vui lòng đăng nhập!");
        }
        console.error("Failed to add item to the cart in the database");
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

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  function ExhibitionContent({ content }) {
    return <div>{convertNewlinesToBreaks(content)}</div>;
  }
  return (
    <div>
      {item && (
        <div>
          <Row className="pp_white_bg">
            <Col md={5} offset={1} className="image_column">
              <Image src={item.picture} alt={item.title} />
            </Col>
            <Col md={14} offset={1} className="shortdetail_column">
              <List className="detail_list">
                <List.Item>
                  <h1>{item.title}</h1>
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
                  <span className="label">Màu sắc:</span>
                  <div style={{ display: 'inline-block', marginLeft: '8px' }}>
                    {color.map((color) => (
                      <div
                        key={color.id}
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          backgroundColor: color.hex,
                          borderRadius: '50%',
                        border: selectedColor?.id === color.id ? '2px solid #000' : '1px solid #ddd',
                          margin: '0 5px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </List.Item>

                {/* Kích thước */}
                <List.Item>
                  <span className="label">Kích thước:</span>
                  <div style={{ marginLeft: '8px' }}>
                    {size.map((size) => (
                      <span
                        key={size.id}
                        style={{
                          padding: '5px 10px',
                          border: selectedSize?.id === size.id ? '2px solid #000' : '1px solid #ddd',
                          margin: '0 5px',
                          cursor: 'pointer',
                          backgroundColor: selectedSize?.id === size.id ? '#f0f0f0' : 'transparent',
                        }}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size.name || `Size: ${size.size || 'Không rõ'}`}
                      </span>
                    ))}
                  </div>
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
                {/* <List.Item style={{ fontSize: "16px", color: "#8c8c8c" }}>
                  <ExhibitionContent content={item.description} />
                </List.Item> */}
              </List>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
