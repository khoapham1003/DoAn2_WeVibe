// SearchBar.js

import React, { useState } from "react";
import { Input, Button, Spin } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearchResult, ...props }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const onSearch = () => {
    localStorage.setItem("datasearch", searchValue);

    if (searchValue) {
      navigate(`/search/${searchValue}`);
      window.location.reload();
    } else {
      navigate(`/`);
      window.location.reload();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "space-around",
      }}
    >
      <Input
        onChange={(e) => setSearchValue(e.target.value)}
        onPressEnter={onSearch}
        value={searchValue}
        placeholder="Search items..."
        allowClear
        size="large"
        style={{
          border: "1px solid #4CAF91",
          backgroundColor: "#F8F9FA",
          color: "#127567",
        }}
        suffix={
          <Button
            style={{
              border: "none",
              boxShadow: "none",
              width: "3rem",
              height: "100%",
              backgroundColor: "transparent",
            }}
            onClick={onSearch}
          >
            <AiOutlineSearch />
          </Button>
        }
        {...props}
      />
    </div>
  );
};

export default SearchBar;
