import { MenuOutlined } from "@ant-design/icons";
import { Menu, Button } from "antd";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";

const { SubMenu } = Menu;

const MenuSlide = ({ onMenuSelect }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");
  const [menuData, setMenuData] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchMenuData = async () => {
    try {
      const response = await fetch("https://localhost:7139/api/Category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMenuData(data);
      console.log("menuslide:", data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
  }, [location.pathname]);

  const renderMenuItems = (menuItems) => {
    return menuItems.map((item) => {
      if (item.lCate_childs && item.lCate_childs.length > 0) {
        return (
          <SubMenu key={item.iCate_id} title={item.sCate_name}>
            {renderMenuItems(item.lCate_childs)}
          </SubMenu>
        );
      } else {
        return <Menu.Item key={item.iCate_id}>{item.sCate_name}</Menu.Item>;
      }
    });
  };

  return (
    <div>
      <Button onClick={() => setMenuVisible(!menuVisible)}>
        <MenuOutlined />
      </Button>
      {menuVisible && (
        <Menu
          selectedKeys={[selectedKeys]}
          style={{
            width: "10vw",
            backgroundColor: "#fff",
            borderRight: "none",
            fontSize: "10px"
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
