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

  const transformMenuData = (data) => {
    const menuMap = {};
    const roots = [];

    data.forEach((item) => {
      menuMap[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.parentId) {
        menuMap[item.parentId]?.children.push(menuMap[item.id]);
      } else {
        roots.push(menuMap[item.id]);
      }
    });

    return roots;
  };

  const fetchMenuData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/category/get-all-categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setMenuVisible(!menuVisible)}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
        }}
      >
        <MenuOutlined />
      </button>
      {menuVisible && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "10px",
            zIndex: 9,
            width: "12rem",
            background: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          <Menu
            selectedKeys={[selectedKeys]}
            style={{
              fontSize: "1rem",
            }}
            onClick={({ key }) => onMenuSelect(key)}
          >
            {renderMenuItems(menuData)}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default MenuSlide;
