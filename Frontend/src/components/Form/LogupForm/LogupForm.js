import { Typography } from "antd";
import "../styleForm.css";
import { Button, Form, Input, ConfigProvider, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

function Logup() {
  const navigate = useNavigate();
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  useEffect(() => {}, []);

  const onFinish = (values) => {
    handleLogUp();
    setSuccess(true);
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    setSuccess(false);
    message.error(`Xin vui lòng nhập đầy đủ thông tin!`);
    console.log("Failed:", errorInfo);
  };

  console.log("isSuccess:", isSuccess);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "lastname") {
      setLastname(value);
    } else if (name === "firstname") {
      setFirstname(value);
    } else if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmpassword") {
      setConfirmpassword(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handleLogUp = async () => {
    try {
      const requestBody = {
        sUser_firstname: firstname,
        sUser_lastname: lastname,
        sUser_email: email,
        sUser_username: username,
        sUser_password: password,
        sUser_confirmpassword: confirmpassword,
      };

      const response = await fetch("https://localhost:7139/api/User/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response:", response);
      console.log("requestBody:", requestBody);

      if (!response.ok) {
        const errorResponse = await response.json();

        if (errorResponse.errors) {
          const usernameError = errorResponse.errors.sUser_username[0];
          message.error(`Đăng ký tài khoản thất bại: ${usernameError}`);
        } else {
          message.error("Đăng ký tài khoản thất bại. Hãy thử lại sau!");
        }
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
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Typography
          className="title_container"
          style={{
            fontWeight: "bolder",
            fontSize: "3vh",
            margin: "0px",
          }}
        >
          Đăng ký
        </Typography>
        <div className="divide_into_2cols">
          <Form.Item
            className="no_margin"
            label={
              <span className="label">
                {" "}
                <span style={{ color: "red" }}>* </span>Họ
              </span>
            }
            name="lastname"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("Xin vui lòng nhập Họ!");
                  }
                  if (/^[^0-9]+$/i.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Họ không thể chứa các ký tự số!");
                  }
                },
              },
            ]}
          >
            <Input
              style={{ height: "3.6vh", fontSize: "1.8vh" }}
              placeholder="Họ"
              name="lastname"
              value={lastname}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item
            className="no_margin"
            label={
              <span className="label">
                {" "}
                <span style={{ color: "red" }}>* </span>Tên
              </span>
            }
            name="firstname"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("Xin vui lòng nhập Tên!");
                  }
                  if (/^[^0-9]+$/i.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Tên không thể chứa các ký tự số!");
                  }
                },
              },
            ]}
          >
            <Input
              style={{ height: "3.6vh", fontSize: "1.8vh" }}
              placeholder="Tên"
              name="firstname"
              value={firstname}
              onChange={handleInputChange}
            />
          </Form.Item>
        </div>
        <Form.Item
          className="no_margin"
          label={
            <span className="label">
              {" "}
              <span style={{ color: "red" }}>* </span>Tên đăng nhập
            </span>
          }
          name="username"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject("Xin vui lòng nhập Tên đăng nhập!");
                }
                if (value.length < 6) {
                  return Promise.reject(
                    "Tên đăng nhập phải chứa ít nhất 6 kí tự!"
                  );
                } else if (/^[^0-9][a-zA-Z0-9]+$/.test(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("Kí tự đầu không được là chữ số!");
                }
              },
            },
          ]}
        >
          <Input
            style={{ height: "3.6vh", fontSize: "1.8vh" }}
            placeholder="Tên đăng nhập"
            name="username"
            value={username}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item
          className="no_margin"
          label={
            <span className="label">
              {" "}
              <span style={{ color: "red" }}>* </span>Mật khẩu
            </span>
          }
          name="password"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject("Xin vui lòng nhập Mật khẩu!");
                }

                if (value.length < 8) {
                  return Promise.reject("Mật khẩu phải chứa ít nhất 8 kí tự!");
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
            style={{ height: "3.6vh", fontSize: "1.8vh" }}
            placeholder="Mật khẩu"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          className="no_margin"
          label={
            <span className="label">
              {" "}
              <span style={{ color: "red" }}>* </span>Xác nhận mật khẩu
            </span>
          }
          name="confirmpassword"
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
                return Promise.reject(
                  new Error("Mật khẩu mới mà bạn vừa nhập không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            style={{ height: "3.6vh", fontSize: "1.8vh" }}
            placeholder="Xác nhận mật khẩu"
            name="confirmpassword"
            value={confirmpassword}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          className="no_margin"
          label={
            <span className="label">
              {" "}
              <span style={{ color: "red" }}>* </span>Email
            </span>
          }
          name="email"
          rules={[
            {
              type: "email",
              message: "Đầu vào không phải là địa chỉ email hợp lệ!",
            },
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject("Xin vui lòng nhập Email!");
                }
              },
            },
          ]}
        >
          <Input
            style={{ height: "3.6vh", fontSize: "1.8vh" }}
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleInputChange}
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
              style={{
                height: "5vh",
                fontSize: "2vh",
              }}
              onClick={handleLogUp}
            >
              Đăng ký
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Logup;
