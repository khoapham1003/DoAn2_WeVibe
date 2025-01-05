import { Typography, message } from "antd";
import { Button, Form, Input, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  // Update the `isSuccess` log whenever it changes
  useEffect(() => {
    console.log("Updated isSuccess:", isSuccess);
  }, [isSuccess]);

  // Handle form submission
  const onFinish = async (values) => {
    console.log("Form Passed. Setting isSuccess to true.");
    setSuccess(true);

    // Call API to handle password reset
    await handleSendCodeClick();
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form Failed Validation:", errorInfo);
    setSuccess(false);
    message.error("Xin vui lòng nhập đầy đủ thông tin!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmpassword") {
      setConfirmpassword(value);
    }
  };

  // API call for password reset
  const handleSendCodeClick = async () => {
    try {
      const data = {
        Email: email,
        Password: password,
        confirmPassword: confirmpassword,
      };
      const apiUrl = `http://localhost:3000/auth/forgotPassword`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("API Error:", error);
        message.error(error.message || "Đã có lỗi xảy ra.");
        setSuccess(false);
      } else {
        message.success("Mật khẩu đã được thay đổi thành công.");
        setSuccess(true);

        // Redirect or perform other actions after success
        navigate("/login");
      }
    } catch (error) {
      console.error("Error sending confirmation code:", error);
      message.error("Không thể kết nối tới máy chủ.");
      setSuccess(false);
    }
  };

  return (
    <div className="background">
      <Form
        layout="vertical"
        className="forgotpassword_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div>
          <Typography style={{ fontWeight: "bolder", fontSize: "1.5rem" }}>
            Quên mật khẩu
          </Typography>
          <Typography style={{ fontSize: "1rem", color: "#bebebe" }}>
            Có vẻ như có chuyện gì đó xảy ra với tài khoản của bạn. Hãy điền
            Email mà bạn đã tạo tài khoản để tiến hành khôi phục tài khoản!
          </Typography>
        </div>

        <Form.Item
          className="no_margin login_input_container"
          label={<span className="label">Email</span>}
          name="email"
          rules={[
            {
              type: "email",
              message: "Đầu vào không phải là địa chỉ email hợp lệ!",
            },
            { required: true, message: "Xin vui lòng nhập Email!" },
          ]}
        >
          <Input
            style={{ height: "3rem", fontSize: "1rem" }}
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleInputChange}
          />
        </Form.Item>

        {/* Password Input */}
        <Form.Item
          className="no_margin login_input_container"
          label={<span className="label">Mật khẩu</span>}
          name="password"
          rules={[
            { required: true, message: "Xin vui lòng nhập Mật khẩu!" },
            { min: 8, message: "Mật khẩu phải chứa ít nhất 8 kí tự!" },
            {
              pattern: /[A-Z]/,
              message: "Mật khẩu phải chứa tối thiểu 1 ký tự in hoa!",
            },
            {
              pattern: /[a-z]/,
              message: "Mật khẩu phải chứa tối thiểu 1 ký tự thường!",
            },
            {
              pattern: /\d/,
              message: "Mật khẩu phải chứa tối thiểu 1 ký tự số!",
            },
            {
              pattern: /[!@#$%^&*(),.?":{}|<>]/,
              message: "Mật khẩu phải chứa tối thiểu 1 ký tự đặc biệt!",
            },
          ]}
        >
          <Input.Password
            style={{ height: "3rem", fontSize: "1rem" }}
            placeholder="Mật khẩu"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item
          className="no_margin login_input_container"
          label={<span className="label">Xác nhận mật khẩu</span>}
          name="confirmpassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Xin vui lòng nhập Xác nhận mật khẩu!",
            },
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
            style={{ height: "3rem", fontSize: "1rem" }}
            placeholder="Xác nhận mật khẩu"
            name="confirmpassword"
            value={confirmpassword}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item className="no_margin login_input_container button_container">
          <ConfigProvider
            theme={{
              token: { colorBorder: "none" },
            }}
          >
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
              Đổi mật khẩu
            </Button>
          </ConfigProvider>
        </Form.Item>
        <Form.Item className="no_margin">
          <span style={{ color: "#1f9d60", fontSize: "0.75rem" }}>
            Quay về trang{" "}
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

export default ForgotPassword;
