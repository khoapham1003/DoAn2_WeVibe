import { Typography, message } from "antd";
import { Button, Form, Input, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function ConfirmCodeForm() {
  const navigate = useNavigate();
  const [confirmcode, setConfirmcode] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  useEffect(() => {}, []);

  const onFinish = (values) => {
    handleConfirmClick();
    setSuccess(true);
    console.log("Success:", values);
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

  const onFinishFailed = (errorInfo) => {
    setSuccess(false);
    message.error(`Xin vui lòng nhập đầy đủ thông tin!`);
    console.log("Failed:", errorInfo);
  };
  console.log("isSuccess:", isSuccess);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmcode") {
      setConfirmcode(value);
    }
  };

  const handleConfirmClick = async () => {
    try {
      const apiUrl =
        "https://localhost:3000/api/User/confirmCodeforgotpassword";
      const jwtToken = getCookie("forgotToken");

      const data = {
        sUser_tokenFP: jwtToken,
        sUser_codeFP: confirmcode,
      };
      console.log(data);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        try {
          const responseBody = await response.clone().text();
          const errorResponse = JSON.parse(responseBody);

          if (errorResponse.errors && errorResponse.errors.sUser_codeFP) {
            const codeErrors = errorResponse.errors.sUser_codeFP;
            const errorString = codeErrors.join(". ");
            message.error(`Xác nhận thất bại: ${errorString}`);
          }
        } catch (parseError) {
          const error = await response.text();
          message.error(`Xác nhận thất bại: ${error}`);
        }
      } else {
        message.success("Xác nhận thành công!");
        navigate(`/change_password`);
      }
    } catch (error) {
      console.error("Error Confirmation Code:", error);
      message.error("Mã xác nhận không đúng. Hãy thử lại sau!");
    }
  };

  return (
    <div className="background">
      <Form
        layout="vertical"
        className="confirmcode_form"
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
            Nhập mã xác nhận
          </Typography>
          <Typography
            style={{
              fontSize: "1.4vh",
              color: "#bebebe",
            }}
          >
            Chúng tôi đã gửi mã xác nhận qua email của bạn, hãy điền mã xác nhận
            để tiến hành khôi phục mật khẩu.
          </Typography>
        </div>
        <Form.Item
          className="no_margin"
          label={
            <span className="label">
              {" "}
              <span style={{ color: "red" }}>* </span>Confirmcode
            </span>
          }
          name="comfirm"
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject("Xin vui lòng nhập Mã xác nhận!");
                }
              },
            },
          ]}
        >
          <Input
            style={{ height: "6vh", fontSize: "2vh" }}
            placeholder="Confirmcode"
            name="confirmcode"
            value={confirmcode}
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
              onClick={handleConfirmClick}
            >
              Xác nhận
            </Button>
          </ConfigProvider>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ConfirmCodeForm;
