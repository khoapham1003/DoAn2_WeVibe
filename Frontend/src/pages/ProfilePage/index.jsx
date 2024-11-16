import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Input,
  Radio,
  Button,
  Space,
  Row,
  Modal,
  Form,
  message,
  Col,
  Card,
} from "antd";
import "../stylePage.css";

import { useNavigate } from "react-router-dom";
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

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const jwtToken = getCookie("accessToken");
  const userId = getCookie("userid");
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({
    sUser_phonenumber: null,
    bUser_sex: null,
  });
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiUrl = `http://localhost:3000/user/get-details/${userId}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data.data);
        console.log(data.data);

        setEditedData({
          phonenumber: data.data.phone,
          bUser_sex: data.data.gender,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, jwtToken]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const data = {
        gender: editedData.bUser_sex.toString(),
        phone: editedData.sUser_phonenumber,
      };
      console.log(data);
      const response = await fetch(
        `http://localhost:3000/user/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        if (error) {
          message.error(`Sai định dạng hoặc thiếu thông tin!`);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setUserData({
        ...userData,
        sUser_phonenumber: editedData.sUser_phonenumber,
        bUser_sex: editedData.bUser_sex,
      });
      message.success(`Đổi thông tin thành công!`);

      setIsEditing(false);
      // window.location.reload();
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedData({
      sUser_phonenumber: userData?.sUser_phonenumber,
      bUser_sex: userData?.bUser_sex,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value,
    });
  };

  const handleRadioChange = (e) => {
    handleInputChange("bUser_sex", e.target.value);
  };

  const handleChangePasswordClick = () => {
    setChangePasswordModalVisible(true);
  };

  const handleOldPasswordChange = (e) => {
    setChangePasswordData({
      ...changePasswordData,
      oldPassword: e.target.value,
    });
  };

  const handleNewPasswordChange = (e) => {
    setChangePasswordData({
      ...changePasswordData,
      newPassword: e.target.value,
    });
  };

  const handleModalCancel = () => {
    // Reset the change password form state and hide the modal
    setChangePasswordData({
      oldPassword: "",
      newPassword: "",
    });
    setChangePasswordModalVisible(false);
  };

  const handleChangePasswordSave = async () => {
    try {
      const data = {
        currentPassword: changePasswordData.oldPassword,
        newPassword: changePasswordData.newPassword,
      };
      console.log(data);

      const response = await fetch(
        `http://localhost:3000/user/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);

      if (!response.ok) {
        try {
          const error = await response.text();
          if (error) {
            message.error(`${error}`);
          }
        } catch (error) {
          // Handle non-JSON response or other errors
          message.error("Vui lòng thử lại sau!");
        }
      }
      if (response.ok) {
        message.success("Thay đổi mật khẩu thành công!");

        setChangePasswordData({
          oldPassword: "",
          newPassword: "",
        });
        setChangePasswordModalVisible(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Thay đổi mật khẩu thất bại. Xin vui lòng thử lại sau!");
    }
  };

  useEffect(() => {
    const fetchHistoryOrder = async () => {
      const apiUrl = `http://localhost:3000/order/get-all-order/${userId}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            token: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setItems(data.data);
        return data;
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchHistoryOrder();
  }, []);

  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    localStorage.setItem("orderhistoryId", item._id);
    navigate(`/history`);
  };

  return (
    <div>
      <h3 class="title-comm">
        <span class="title-holder">TÀI KHOẢN CỦA TÔI</span>
      </h3>
      <Row>
        <h2 className="detail_h2">THÔNG TIN CÁ NHÂN</h2>
      </Row>
      <div className="cover">
        <Col className="profilepage_container">
          {userData && (
            <Descriptions className="description" column={1}>
              <Descriptions.Item label="Họ và Tên">
                {userData.name}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {isEditing ? (
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={editedData.bUser_sex}
                  >
                    <Radio value="true">Nam</Radio>
                    <Radio value="false">Nữ</Radio>
                  </Radio.Group>
                ) : userData.gender ? (
                  "Nam"
                ) : (
                  "Nữ"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {isEditing ? (
                  <Input
                    value={editedData.phone}
                    onChange={(e) =>
                      handleInputChange("sUser_phonenumber", e.target.value)
                    }
                  />
                ) : (
                  userData.phone || "N/A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userData.email}
              </Descriptions.Item>
            </Descriptions>
          )}
          <Space>
            {isEditing ? (
              <>
                <Button type="primary" onClick={handleSaveClick}>
                  Lưu
                </Button>
                <Button onClick={handleCancelClick}>Hủy</Button>
              </>
            ) : (
              <Button
                size="large"
                className="profilepage_button"
                onClick={handleEditClick}
              >
                Thay đổi
              </Button>
            )}
          </Space>
        </Col>

        <Row>
          <h2 className="detail_h2">ĐỔI MẬT KHẨU</h2>
          <div className="profilepage_container">
            <Button
              size="large"
              className="profilepage_button"
              onClick={handleChangePasswordClick}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Row>
        <Modal
          title="Change Password"
          visible={isChangePasswordModalVisible}
          onCancel={handleModalCancel}
          footer={[
            <Button key="cancel" onClick={handleModalCancel}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleChangePasswordSave}
            >
              Save Password
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item
              className="no_margin"
              label={<p className="label">Mật khẩu cũ</p>}
              name="oldpassword"
              rules={[
                {
                  required: true,
                  message: "Xin vui lòng nhập Mật khẩu cũ!",
                },
              ]}
            >
              <Input.Password
                name="oldpassword"
                placeholder="Mật khẩu cũ"
                value={changePasswordData.oldPassword}
                onChange={handleOldPasswordChange}
              />
            </Form.Item>
            <Form.Item
              className="no_margin"
              label={<p className="label">Mật khẩu Mới</p>}
              name="newpassword"
              rules={[
                {
                  required: true,
                  message: "Xin vui lòng nhập Mật khẩu!",
                },
              ]}
            >
              <Input.Password
                value={changePasswordData.newPassword}
                placeholder="Mật khẩu mới"
                name="newpassword"
                onChange={handleNewPasswordChange}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Row>
          <h2 className="detail_h2">LỊCH SỬ GIAO DỊCH</h2>
        </Row>
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {items.map((item) => (
            <Card
              className="order_history_cart"
              bodyStyle={{ padding: "5px 3vw 0px" }}
              hoverable
              onClick={() => handleCardClick(item)}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tên người nhận">
                  {item.shippingAddress.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT">
                  {item.shippingAddress.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ nhận hàng">
                  {item.shippingAddress.address}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày mua">
                  {item.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng đơn hàng">
                  {item.totalPrice}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
