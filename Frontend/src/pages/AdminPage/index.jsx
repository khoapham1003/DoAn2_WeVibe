import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Modal,
  Form,
  Input,
  InputNumber,
  Tabs,
} from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ProductAdmin from "./Component/Product";
import UserAdmin from "./Component/User";
import OrderAdmin from "./Component/Order";

const { TabPane } = Tabs;

function AdminPage() {
  const [activeTab, setActiveTab] = useState("product");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Products" key="product">
          <ProductAdmin />
        </TabPane>
        <TabPane tab="Users" key="user">
          <UserAdmin />
        </TabPane>
        <TabPane tab="Orders" key="order">
          <OrderAdmin />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default AdminPage;
