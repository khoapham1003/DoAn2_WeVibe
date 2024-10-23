import { Typography, message } from "antd";
import { Button, Form, Input, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  useEffect(() => {}, []);

  const onFinish = (values) => {
    setSuccess(true);
    handleSendCodeClick();
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
    if (name === "email") {
      setEmail(value);
    }
  };
  const handleSendCodeClick = async () => {
    try {
      const apiUrl = `https://localhost:7139/api/User/forgotpassword`;
      const requestBody = email;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.text();
        if (error) {
          message.error(`${error}`);
        }
      } else {
        const responseData = await response.text();
        document.cookie = `forgotToken=${responseData}; path=/`;
        navigate(`/confirm_code`);
        message.success("Mã xác nhận đã được gửi thành công.");
      }
    } catch (error) {
      console.error("Error sending confirmation code:", error);
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="background">
      <Form
        layout="vertical"
        className="forgotpassword_form"
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
            Quên mật khẩu
          </Typography>
          <Typography
            style={{
              fontSize: "1.4vh",
              color: "#bebebe",
            }}
          >
            Có vẻ như có chuyện gì đó xãy ra với tài khoản của bạn. Hãy điền
            Email mà bạn đã tạo tài khoản để tiến hành khôi phục tài khoản!
          </Typography>
        </div>
        <Form.Item
          className="no_margin"
          label={
            <span className="label">
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
            style={{ height: "6vh", fontSize: "2vh" }}
            placeholder="Email"
            name="email"
            value={email}
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
              onClick={handleSendCodeClick}
            >
              Gửi mã xác nhận
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ForgotPassword;
