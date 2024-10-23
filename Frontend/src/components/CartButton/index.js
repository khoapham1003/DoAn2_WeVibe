import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function CartButton() {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        icon={<ShoppingCartOutlined />}
        style={{
          display: "inline",
          height: "4vh",
          width: "4vh",
          border: "none",
          boxShadow: "none",
        }}
        onClick={() => {
          navigate("/cart");
        }}
      ></Button>
    </div>
  );
}

export default CartButton;
