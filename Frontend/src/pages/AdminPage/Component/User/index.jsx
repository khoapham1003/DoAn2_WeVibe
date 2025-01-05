import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IoMdAdd } from "react-icons/io";

const { Option } = Select;

function UserAdmin() {
  const [items, setItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const { confirm } = Modal;

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
  const userId = getCookie("userid");
  const jwtToken = getCookie("accessToken");

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/get-all-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      setItems(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Propagate the error to handle it in the calling code
    }
  };

  return (
    <div>
      <div className="cop_cartlist_header">
        <Col md={6} offset={2}>
          <h3>Tên</h3>
        </Col>
        <Col md={2} offset={1}>
          <h3>Số Điện Thoại</h3>
        </Col>
        <Col md={5} offset={2}>
          <h3>Email</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Role</h3>
        </Col>
      </div>
      <div className="cop_cartlist_item">
        {items.map((item) => (
          <Card className="cop_item_cart" key={item.UserId}>
            <Row align="middle">
              <Col md={6} offset={2}>
                <span>
                  {item.firstName + " " + item.middleName + " " + item.lastName}
                </span>
              </Col>
              <Col md={2} offset={1}>
                <span>{item.phoneNumber}</span>
              </Col>
              <Col md={5} offset={2}>
                <span className="cop_item_price">{item.email}</span>
              </Col>
              <Col md={3} offset={1}>
                <span className="cop_item_price">
                  {item.admin ? "Admin" : "User"}
                </span>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UserAdmin;
