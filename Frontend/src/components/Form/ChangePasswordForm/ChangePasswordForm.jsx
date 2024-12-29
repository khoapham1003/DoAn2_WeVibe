import { Typography } from "antd";
import "../styleForm.css";
import { useState, useEffect } from "react";
import { Button, Form, Input, ConfigProvider, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ChangePassword() {
  const navigate = useNavigate();
  const [isSuccess, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const onFinish = (values) => {
    setSuccess(true);
    handleChange();
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    setSuccess(false);
    message.error(`Xin vui lòng nhập đầy đủ thông tin!`);
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {}, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmpassword") {
      setConfirmpassword(value);
    }
  };

  const handleChange = async () => {
    try {
      const apiUrl = `http://localhost:3000/user/change-password/${userId}`;

      const data = {
        Password: password,
        confirmPassword: confirmpassword,
      };
      console.log(data);
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
          message.error("Cập nhật mật khẩu thất bại!");
        }
      } else {
        message.success("Cập nhật mật khẩu thành công!");
        navigate(`/sign_in`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error Change Password:", error);
      message.error("Mã xác nhận không đúng. Hãy thử lại sau!");
    }
  };

  return (
    <div className="background">
      <Form
        layout="vertical"
        className="changepassword_form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div>
          <Typography
            style={{
              fontWeight: "bolder",
              fontSize: "3vh",
            }}
          >
            Đổi mật khẩu
          </Typography>

          <Typography
            style={{
              fontSize: "1.4vh",
              color: "#bebebe",
            }}
          >
            Hãy cập nhật mật khẩu mới của bạn!
          </Typography>
        </div>
        <Form.Item
          className="no_margin"
          label={
            <span className="label">
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
            style={{ height: "6vh", fontSize: "2vh" }}
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
              <span style={{ color: "red" }}>* </span>Xác nhận mật khẩu
            </span>
          }
          name="confirmpassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            style={{ height: "6vh", fontSize: "2vh" }}
            placeholder="Xác nhận mật khẩu"
            name="confirmpassword"
            value={confirmpassword}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item className="no_margin">
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
              onClick={handleChange}
            >
              Xác nhận
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;
