import { Button, Card, Col, Form, Modal, Row, Input, message } from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

const { TextArea } = Input;
const { confirm } = Modal;

function SizeManagement() {
  const [items, setItems] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    fetchSizeData();
  }, []);

  const fetchSizeData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/sizes/get-all-sizes",
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
      setItems(data);
    } catch (error) {
      console.error("Error fetching Size data:", error);
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

  const addSize = async (requestBody) => {
    try {
      if (requestBody.size) {
        requestBody.size = parseInt(requestBody.size, 10);
      }
      const response = await fetch("http://localhost:3000/sizes/create-size", {
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
      await fetchSizeData(); // Refresh categories lis
      setIsAddModalVisible(false);
      message.success("Thêm danh mục kích thước thành công!");
    } catch (error) {
      message.error("Thêm danh mục kích thước thất bại!");
      console.error("Error adding Size:", error);
    }
  };

  const editSize = async (itemId, requestBody) => {
    try {
      if (requestBody.size) {
        requestBody.size = parseInt(requestBody.size, 10);
      }
      const response = await fetch(
        `http://localhost:3000/sizes/update-size/${itemId}`,
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

      await fetchSizeData();
      setIsEditModalVisible(false);
      message.success("Cập nhật danh mục kích thước thành công!");
    } catch (error) {
      message.error("Cập nhật danh mục kích thước thất bại!");
      console.error("Error updating Size:", error);
    }
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        addSize(values);
        setIsAddModalVisible(false);
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
        editSize(currentItemId, values);
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
        size: parseInt(item.size) || "",
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
        `http://localhost:3000/sizes/delete-size/${itemId}`,
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
      fetchSizeData(); // Refresh categories list
      message.success("Xóa danh mục kích thước thành công!");
    } catch (error) {
      message.error("Xóa danh mục kích thước thất bại!");
      console.error("Error deleting Size:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsAddModalVisible(true)}
        className="profilepage_button"
      >
        <IoMdAdd />
        <strong>Thêm mới kích cỡ</strong>
      </Button>

      <div className="cop_cartlist_header">
        <Col md={5} offset={5}>
          <h3>Tên Size</h3>
        </Col>
        <Col md={5} offset={1}>
          <h3>Số Size</h3>
        </Col>
      </div>

      <div className="cop_cartlist_item">
        {items.map((item) => (
          <Card className="cop_item_cart" key={item.id}>
            <Row align="middle">
              <Col md={5} offset={5}>
                <span>{item.name}</span>
              </Col>
              <Col md={5} offset={1}>
                <span>{item.size}</span>
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

      {/* Add Size Modal */}
      <Modal
        title="Add Size"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="name"
            label="name"
            rules={[{ required: true, message: "Vui lòng nhập tên size!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="size"
            label="size"
            rules={[{ required: true, message: "Vui lòng nhập số size!" }]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Size Modal */}
      <Modal
        title="Edit Size"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="name"
            rules={[{ required: true, message: "Vui lòng nhập tên size!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="size"
            label="size"
            rules={[{ required: true, message: "Vui lòng nhập số size!" }]}
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SizeManagement;
