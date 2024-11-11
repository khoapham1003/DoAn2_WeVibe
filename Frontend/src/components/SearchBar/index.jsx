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
        placeholder="Search book"
        allowClear
        size="large"
        style={{ backgroundColor: "#d0d3cc" }}
        {...props}
      />
      <Button
        style={{
          border: "none",
          background: "#ffffff",
          boxShadow: "none",
          marginTop: "0.25rem",
          width: "4rem",
        }}
        onClick={onSearch}
      >
        <AiOutlineSearch />
      </Button>
    </div>
  );
};

export default SearchBar;
