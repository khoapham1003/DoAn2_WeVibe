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
import OrderStatistics from "./Component/Order";
import CategoriesAdmin from "./Component/Category";

const { TabPane } = Tabs;

function AdminPage() {
  const [activeTab, setActiveTab] = useState("order");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="card_container">
      <Tabs
        className="admin_tab_container"
        activeKey={activeTab}
        onChange={handleTabChange}
      >
        <TabPane tab="Đơn hàng" key="order">
          <OrderStatistics />
        </TabPane>
        <TabPane tab="Sản phẩm" key="product">
          <ProductAdmin />
        </TabPane>
        <TabPane tab="Danh mục" key="categories">
          <CategoriesAdmin />
        </TabPane>
        <TabPane tab="Người dùng" key="user">
          <UserAdmin />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default AdminPage;
