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
import "./../../../stylePage.css";

const { Option } = Select;

function ProductAdmin() {
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
      const response = await fetch("http://localhost:3000/product/get-all", {
        headers: {
          "Content-Type": "application/json",
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

  const removeProduct = async (ItemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/product/delete/${ItemId}`,
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

  const handleRemoveItem = (ItemId) => {
    removeProduct(ItemId);
  };

  const editProduct = async (ItemId, requestBody) => {
    try {
      const response = await fetch(
        `http://localhost:3000/product/update/${ItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductData();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const addProduct = async (requestBody) => {
    try {
      const response = await fetch("http://localhost:3000/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const showEditForm = (ItemId) => {
    setCurrentItemId(ItemId);
    const item = items.find((i) => i._id === ItemId);
    form.setFieldsValue({
      name: item.name,
      price: item.price,
      countInStock: item.countInStock,
      description: item.description,
      image: item.image,
      type: item.type,
    });
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        editProduct(currentItemId, values);
        setIsEditModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const showAddForm = () => {
    setIsAddModalVisible(true);
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        addProduct(values);
        setIsAddModalVisible(false);
        addForm.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const showConfirm = (itemId) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      icon: <ExclamationCircleOutlined />,
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        handleRemoveItem(itemId);
      },
      onCancel() {
        console.log("Hủy bỏ xóa sản phẩm");
      },
    });
  };

  return (
    <div>
      <Button onClick={showAddForm} className="profilepage_button admin_button">
        <IoMdAdd />
        <em />
        <strong> ADD PRODUCT</strong>
      </Button>
      <div className="cop_cartlist_header">
        <Col md={3} offset={1}>
          <h3>Sản phẩm</h3>
        </Col>
        <Col md={4}></Col>
        <Col md={3} offset={1}>
          <h3>Đơn giá</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Số lượng</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Loại</h3>
        </Col>
      </div>
      <div className="cop_cartlist_item">
        {items.map((item) => (
          <Card className="cop_item_cart" key={item._id}>
            <Row align="middle">
              <Col md={2} offset={1}>
                <Image
                  style={{
                    height: 80,
                    width: 80,
                  }}
                  alt={item.name}
                  src={item.image}
                />
              </Col>
              <Col md={4} offset={1}>
                <span>{item.name}</span>
              </Col>
              <Col md={3} offset={1}>
                <span>{item.price}đ</span>
              </Col>
              <Col md={3} offset={1}>
                <span>{item.countInStock}</span>
              </Col>
              <Col md={3} offset={1}>
                <span className="cop_item_price">{item.type}</span>
              </Col>
              <Col md={3} offset={1}>
                <span>
                  <Button onClick={() => showConfirm(item._id)}>
                    <FaTrash />
                  </Button>
                  <Button onClick={() => showEditForm(item._id)}>
                    <FaEdit />
                  </Button>
                </span>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
      <Modal
        title="Chỉnh sửa sản phẩm"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="edit_product_form">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="countInStock"
            label="Số lượng trong kho"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng trong kho!" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm sản phẩm mới"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        okText="Thêm"
        cancelText="Hủy bỏ"
      >
        <Form form={addForm} layout="vertical" name="add_product_form">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[
              { required: true, message: "Vui lòng nhập link hình ảnh!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại"
            rules={[
              { required: true, message: "Vui lòng chọn loại sản phẩm!" },
            ]}
          >
            <Select>
              <Option value="ring">Nhẫn</Option>
              <Option value="necklace">Vòng Cổ</Option>
              <Option value="pendant">Dây Chuyền</Option>
              <Option value="earing">Khuyên Tai</Option>
              <Option value="bracelet">Lắc Tay</Option>
              <Option value="bangle">Vòng Tay</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="countInStock"
            label="Số lượng trong kho"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng trong kho!" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductAdmin;
