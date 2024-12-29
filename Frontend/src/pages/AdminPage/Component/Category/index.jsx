import { Tabs } from "antd";
import CategoryManagement from "./Category";
import ColorManegement from "./Color";
import SizeManagement from "./Size";
import React, { useState, useEffect } from "react";

const { TabPane } = Tabs;
function CategoriesAdmin() {
  const [activeTab, setActiveTab] = useState("category");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Category" key="category">
          <CategoryManagement />
        </TabPane>
        <TabPane tab="Size" key="size">
          <SizeManagement />
        </TabPane>
        <TabPane tab="Color" key="color">
          <ColorManegement />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default CategoriesAdmin;
