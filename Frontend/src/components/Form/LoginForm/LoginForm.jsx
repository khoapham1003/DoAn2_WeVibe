import { Typography, ConfigProvider, Form, Input, Button, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const values = await form.validateFields();
      const { username, password } = values;

      const requestBody = {
        Email: username,
        Password: password,
      };

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error) {
          message.error(`${error.message}`);
        }
      } else {
        const responseData = await response.json();
        console.log(responseData);
        const accessToken = responseData.access_token;
        if (accessToken) {
          try {
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
            const email = decodedToken.email;
            const CartId = decodedToken.CartId;
            const UserId = decodedToken.UserId;
            const role = decodedToken.role;
            document.cookie = `accessToken=${responseData.access_token}; path=/`;
            document.cookie = `email=${email}; path=/`;
            document.cookie = `CartId=${CartId}; path=/`;
            document.cookie = `userid=${UserId}; path=/`;
            document.cookie = `role=${role}; path=/`;
            await message.success("Đăng nhập thành công!");
            if (role == "admin") {
              navigate(`/admin`);
            } else {
              navigate(`/`);
            }
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background">
      <Form
        form={form}
        layout="vertical"
        className="login_form"
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
      >
        <Typography
          className="title_container"
          style={{ fontWeight: "bolder", fontSize: "3vh" }}
        >
          Đăng nhập
        </Typography>

        <Form.Item
          className="no_margin login_input_container"
          label={<span className="label">Tên đăng nhập</span>}
          name="username"
          rules={[
            { required: true, message: "Xin vui lòng nhập Tên đăng nhập!" },
          ]}
        >
          <Input
            placeholder="Tên đăng nhập"
            style={{ height: "6vh", fontSize: "2vh" }}
          />
        </Form.Item>

        <Form.Item
          className="no_margin login_input_container"
          label={<span className="label">Mật khẩu</span>}
          name="password"
          rules={[{ required: true, message: "Xin vui lòng nhập Mật khẩu!" }]}
        >
          <Input.Password
            placeholder="Mật khẩu"
            style={{
              height: "6vh",
              fontSize: "2vh",
            }}
          />
        </Form.Item>

        <Form.Item className="no_margin button_container">
          <ConfigProvider
            theme={{
              token: {
                colorBorder: "none",
              },
            }}
          >
            <Button
              className="button"
              block
              type="default"
              htmlType="submit"
              onClick={handleLogIn}
              style={{
                height: "5vh",
                fontSize: "2vh",
              }}
            >
              Đăng nhập
            </Button>
          </ConfigProvider>
        </Form.Item>

        <div className="functions login_function_container ">
          <Form.Item className="no_margin">
            <a
              className="forgotpassword_nav"
              href="/forgot_password"
              style={{ color: "#1f9d60", fontSize: "1.5vh" }}
            >
              Quên mật khẩu
            </a>
          </Form.Item>

          <Form.Item className="no_margin">
            <span style={{ color: "#1f9d60", fontSize: "1.5vh" }}>
              Bạn chưa có tài khoản?{" "}
            </span>
            <a
              className="logup_nav"
              href="/sign_up"
              style={{ color: "#CF4330", fontSize: "1.5vh" }}
            >
              Đăng ký tại đây
            </a>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default Login;
