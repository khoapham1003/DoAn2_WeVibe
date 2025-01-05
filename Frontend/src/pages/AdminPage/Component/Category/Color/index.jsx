import { Button, Card, Col, Form, Modal, Row, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

const { TextArea } = Input;
const { confirm } = Modal;

function ColorManegement() {
  const [items, setItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/color/get-all-colors",
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
      setItems(data.data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

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

  const addCategory = async (requestBody) => {
    try {
      const response = await fetch("http://localhost:3000/color/create-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchCategoryData(); // Refresh categories list
      message.success("Thêm danh mục màu sắc thành công!");
      setIsAddModalVisible(false);
    } catch (error) {
      message.error("Thêm danh mục màu sắc thất bại!");
      console.error("Error adding category:", error);
    }
  };

  const editCategory = async (itemId, requestBody) => {
    try {
      const response = await fetch(
        `http://localhost:3000/color/update-corlor/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchCategoryData();
      setIsEditModalVisible(false);
      message.success("Sửa danh mục màu sắc thành công!");
    } catch (error) {
      message.error("Sửa danh mục màu sắc thất bại!");
      console.error("Error updating category:", error);
    }
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        addCategory(values);
        addForm.resetFields();
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        editCategory(currentItemId, values);
        setIsEditModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const showEditForm = (itemId) => {
    setCurrentItemId(itemId);
    const item = items.find((i) => i.id === itemId);
    if (item) {
      form.setFieldsValue({
        name: item.name || "",
        hex: item.hex || "",
      });
    }
    setIsEditModalVisible(true);
  };

  const showConfirm = (itemId) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa không?",
      icon: <FaTrash />,
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        handleRemoveItem(itemId);
      },
    });
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/color/delete-color/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchCategoryData(); // Refresh categories list
      message.success("Xóa danh mục màu sắc thành công!");
    } catch (error) {
      message.error("Xóa danh mục màu sắc thất bại!");
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsAddModalVisible(true)}
        className="profilepage_button"
      >
        <IoMdAdd />
        <strong>Thêm mới màu sắc</strong>
      </Button>

      <div className="cop_cartlist_header">
        <Col md={4} offset={4}>
          <h3>Màu</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Tên màu</h3>
        </Col>
        <Col md={3} offset={1}>
          <h3>Mã hex</h3>
        </Col>
      </div>

      <div className="cop_cartlist_item">
        {items.map((item) => (
          <Card className="cop_item_cart" key={item.id}>
            <Row align="middle">
              <Col md={4} offset={4}>
                <div
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    backgroundColor: item.hex,
                    borderRadius: "50%",
                    border: "2px solid #000",
                    margin: "0 5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleColorSelect(color)}
                />
              </Col>
              <Col md={3} offset={1}>
                <span>{item.name}</span>
              </Col>
              <Col md={3} offset={1}>
                <span>{item.hex}</span>
              </Col>
              <Col md={3} offset={1}>
                <Button onClick={() => showConfirm(item.id)}>
                  <FaTrash />
                </Button>
                <Button onClick={() => showEditForm(item.id)}>
                  <FaEdit />
                </Button>
              </Col>
            </Row>
          </Card>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        title="Add Color"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="name"
            label="name"
            rules={[{ required: true, message: "Vui lòng nhập tên màu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hex"
            label="hex"
            rules={[{ required: true, message: "Vui lòng nhập mã hex!" }]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="name"
            rules={[{ required: true, message: "Vui lòng nhập tên màu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hex"
            label="hex"
            rules={[{ required: true, message: "Vui lòng nhập mã hex!" }]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ColorManegement;
