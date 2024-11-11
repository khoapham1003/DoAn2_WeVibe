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
    phonenumber: null,
    dob: null,
    sex: null,
  });
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiUrl = `https://localhost:7139/api/User/${userId}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
        setEditedData({
          sUser_phonenumber: data.sUser_phonenumber,
          dtUser_dob: data.dtUser_dob,
          bUser_sex: data.bUser_sex,
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
        gUser_id: userId,
        sUser_firstname: userData.sUser_firstname,
        sUser_lastname: userData.sUser_lastname,
        dtUser_dob: editedData.dtUser_dob,
        bUser_sex: Boolean(editedData.bUser_sex),
        sUser_phonenumber: editedData.sUser_phonenumber,
      };
      console.log(data);
      const response = await fetch(
        `https://localhost:7139/api/User/updateinfor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
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
        dtUser_dob: editedData.dtUser_dob,
        bUser_sex: editedData.bUser_sex,
      });
      message.success(`Đổi thông tin thành công!`);

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedData({
      sUser_phonenumber: userData?.sUser_phonenumber,
      dtUser_dob: userData?.dtUser_dob,
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

  const handleConfirmNewPasswordChange = (e) => {
    setChangePasswordData({
      ...changePasswordData,
      confirmNewPassword: e.target.value,
    });
  };

  const handleModalCancel = () => {
    // Reset the change password form state and hide the modal
    setChangePasswordData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setChangePasswordModalVisible(false);
  };

  const handleChangePasswordSave = async () => {
    try {
      const apiUrl = "https://localhost:7139/api/User/ChangePassword";

      const data = {
        gUser_id: userId,
        sUser_oldPassword: changePasswordData.oldPassword,
        sUser_newPassword: changePasswordData.newPassword,
        sUser_confirmnewPassword: changePasswordData.confirmNewPassword,
      };
      console.log(data);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      });

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
          confirmNewPassword: "",
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
      try {
        const response = await fetch(
          `https://localhost:7139/api/Order/history?gUser_id=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setItems(data);
        return data;
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchHistoryOrder();
  }, []);

  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    localStorage.setItem("orderhistoryId", item.iOrder_id);
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
              <Descriptions.Item label="Họ">
                {userData.sUser_firstname}
              </Descriptions.Item>
              <Descriptions.Item label="Tên">
                {userData.sUser_lastname}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {isEditing ? (
                  <Input
                    placeholder="yyyy-mm-dd"
                    value={editedData.dtUser_dob}
                    onChange={(e) =>
                      handleInputChange("dtUser_dob", e.target.value)
                    }
                  />
                ) : (
                  userData.dtUser_dob || "N/A"
                )}
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
                ) : userData.bUser_sex ? (
                  "Nam"
                ) : (
                  "Nữ"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {isEditing ? (
                  <Input
                    value={editedData.sUser_phonenumber}
                    onChange={(e) =>
                      handleInputChange("sUser_phonenumber", e.target.value)
                    }
                  />
                ) : (
                  userData.sUser_phonenumber || "N/A"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userData.sUser_email}
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
                {
                  validator: (_, value) => {
                    if (value.length < 8) {
                      return Promise.reject(
                        "Mật khẩu phải chứa ít nhất 8 kí tự!"
                      );
                    }
                    if (!/[A-Z]/.test(value)) {
                      return Promise.reject(
                        "Mật khẩu phải chứa tối thiểu 1 ký tự in hoa!"
                      );
                    }
                    if (!/[a-z]/.test(value)) {
                      return Promise.reject(
                        "Mật khẩu phải chứa tối thiểu 1 ký tự thường!"
                      );
                    }
                    if (!/\d/.test(value)) {
                      return Promise.reject(
                        "Mật khẩu phải chứa tối thiểu 1 ký tự số!"
                      );
                    }
                    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                      return Promise.reject(
                        "Mật khẩu phải chứa tối thiểu 1 ký tự đặc biệt!"
                      );
                    }
                    return Promise.resolve();
                  },
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

            <Form.Item
              className="no_margin"
              label={<p className="label">Xác nhận mật khẩu mới</p>}
              name="confirmpassword"
              dependencies={["newpassword"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Xin vui lòng xác nhận mật khẩu mới!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newpassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                value={changePasswordData.confirmNewPassword}
                placeholder="xác nhận mật khẩu mới"
                name="confirmnewpassword"
                onChange={handleConfirmNewPasswordChange}
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
                  {item.sOrder_name_receiver}
                </Descriptions.Item>
                <Descriptions.Item label="SĐT">
                  {item.sOrder_phone_receiver}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ nhận hàng">
                  {item.sOrder_address_receiver}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày mua">
                  {item.dtOrrder_dateorder}
                </Descriptions.Item>
                 <Descriptions.Item label="Tổng đơn hàng">
                  {item.vOrder_total}
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
