import { Typography, Row, Col } from "antd";
import "../styleForm.css";
import { Button, Form, Input, ConfigProvider, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

function Logup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {}, []);

  const onFinish = (values) => {
    handleLogUp();
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    message.error(`Xin vui lòng nhập đầy đủ thông tin!`);
    console.log("Failed:", errorInfo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "middleName") {
      setMiddleName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "phoneNumber") {
      setPhoneNumber(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleLogUp = async () => {
    try {
      const requestBody = {
        firstName,
        middleName,
        lastName,
        phoneNumber,
        email,
        password,
        confirmPassword,
      };
      console.log("Failed:", requestBody);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        message.error("Đăng ký tài khoản thất bại. Hãy thử lại sau!");
        message.error(response.json);
      } else {
        message.success(`Đăng ký tài khoản thành công!`);
        navigate(`/sign_in`);
      }
    } catch (error) {
      console.error("Error sign up:", error);
    }
  };

  return (
    <div className="background">
      <Form
        layout="vertical"
        className="logup_form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Typography
          className="title_container"
          style={{ fontWeight: "bolder", fontSize: "1.5rem" }}
        >
          Đăng ký
        </Typography>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              className="no_margin login_input_container"
              label="Họ"
              name="lastName"
            >
              <Input
                name="lastName"
                value={lastName}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              className="no_margin login_input_container"
              label="Tên lót"
              name="middleName"
            >
              <Input
                name="middleName"
                value={middleName}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              className="no_margin login_input_container"
              label="Tên"
              name="firstName"
              rules={[{ required: true, message: "Xin vui lòng nhập Tên!" }]}
            >
              <Input
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          className="no_margin login_input_container"
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "Đầu vào không phải là địa chỉ email hợp lệ!",
            },
            { required: true, message: "Xin vui lòng nhập Email!" },
          ]}
        >
          <Input name="email" value={email} onChange={handleInputChange} />
        </Form.Item>
        <Form.Item
          className="no_margin login_input_container"
          label="Số điện thoại"
          name="phoneNumber"
        >
          <Input
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          className="no_margin login_input_container"
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Xin vui lòng nhập Mật khẩu!" }]}
        >
          <Input.Password
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          className="no_margin login_input_container"
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject("Xin vui lòng nhập Mật khẩu xác nhận!");
                }
                if (getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Mật khẩu mới không khớp!");
              },
            }),
          ]}
        >
          <Input.Password
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item className="no_margin button_container">
          <ConfigProvider theme={{ token: { colorBorder: "none" } }}>
            <Button
              className="button"
              block
              type="default"
              htmlType="submit"
              style={{
                height: "2.5rem",
                fontSize: "1rem",
              }}
            >
              Đăng ký
            </Button>
          </ConfigProvider>
        </Form.Item>
        <Form.Item className="no_margin">
          <span style={{ color: "#1f9d60", fontSize: "0.75rem" }}>
            Bạn đã có tài khoản?{" "}
          </span>
          <a
            className="logup_nav"
            href="/sign_in"
            style={{ color: "#CF4330", fontSize: "0.75rem" }}
          >
            Đăng nhập
          </a>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Logup;
