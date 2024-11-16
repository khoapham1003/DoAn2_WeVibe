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
      const response = await fetch("http://localhost:3000/user/getAll", {
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${jwtToken}`,
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

  const removeProduct = async (UserId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/delete-user/${UserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductData();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleRemoveUser = (UserId) => {
    removeProduct(UserId);
  };

  const showConfirm = (userId) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa user này không?",
      icon: <ExclamationCircleOutlined />,
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        handleRemoveUser(userId);
      },
      onCancel() {
        console.log("Hủy bỏ xóa user");
      },
    });
  };

  return (
    <div>
      <div className="cop_cartlist_header">
        <Col md={2} offset={1}>
          <h3>Tên</h3>
        </Col>
        <Col md={2}></Col>
        <Col md={3} offset={1}>
          <h3>Số Điện Thoại</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Email</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Địa chỉ</h3>
        </Col>
      </div>
      <div className="cop_cartlist_item">
        {items.map((item) => (
          <Card className="cop_item_cart" key={item._id}>
            <Row align="middle">
              <Col md={5} offset={1}>
                <span>{item.name}</span>
              </Col>
              <Col md={3}>
                <span>{item.phone}</span>
              </Col>
              <Col md={3} offset={1}>
                <span className="cop_item_price">{item.email}</span>
              </Col>
              <Col md={6} offset={1}>
                <span>{item.address}</span>
              </Col>
              <Col md={3} offset={1}>
                <span>
                  <Button onClick={() => showConfirm(item._id)}>
                    <FaTrash />
                  </Button>
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
