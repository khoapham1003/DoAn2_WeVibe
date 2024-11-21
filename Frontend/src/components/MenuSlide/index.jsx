import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const { SubMenu } = Menu;

const MenuSlide = ({ onMenuSelect }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [menuData, setMenuData] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // Function to transform flat data to nested structure
  const transformMenuData = (data) => {
    const menuMap = {};
    const roots = [];

    data.forEach((item) => {
      menuMap[item.id] = { ...item, children: [] };
    });

    // Build the tree structure
    data.forEach((item) => {
      if (item.parentId) {
        // If item has a parentId, push it into its parent's children
        menuMap[item.parentId]?.children.push(menuMap[item.id]);
      } else {
        // If no parentId, it's a root item
        roots.push(menuMap[item.id]);
      }
    });

    return roots;
  };

  // Fetch menu data and transform it
  const fetchMenuData = async () => {
    try {
      const response = await fetch("http://localhost:3000/category/get-all-categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const transformedData = transformMenuData(data.data);
      setMenuData(transformedData);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    setSelectedKeys(location.pathname);
  }, [location.pathname]);

  // Render menu items recursively
  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <SubMenu key={item.id} title={item.title}>
            {renderMenuItems(item.children)}
          </SubMenu>
        );
      } else {
        return <Menu.Item key={item.id}>{item.title}</Menu.Item>;
      }
    });
  };

  return (
    <div>
      <button onClick={() => setMenuVisible(!menuVisible)}>
        <MenuOutlined />
      </button>
      {menuVisible && (
        <Menu
          selectedKeys={[selectedKeys]}
          style={{
            backgroundColor: "#fff",
            borderRight: "none",
            fontSize: "10px",
          }}
          onClick={({ key }) => onMenuSelect(key)}
        >
          {renderMenuItems(menuData)}
        </Menu>
      )}
    </div>
  );
};

export default MenuSlide;
