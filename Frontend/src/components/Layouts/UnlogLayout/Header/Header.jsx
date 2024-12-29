import classNames from "classnames/bind";
import images from "../../../../assets/images";
import MenuSlide from "../../../MenuSlide";
import SearchBar from "../../../SearchBar";
import CartButton from "../../../CartButton";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown } from "antd";

const cx = classNames.bind();

function Header() {
  const navigate = useNavigate();

  return (
    <header className={cx("h_wrapper")}>
      <div className={cx("inner h_log_inner h_inner")}>
        <div
          className={cx("h_logo")}
          onClick={() => {
            navigate("/");
          }}
        >
          <img className="h_logo_image" src={images.logo} alt="WeVibe" />
        </div>
        <div className={cx("h_search_bar")}>
          <SearchBar />
        </div>
        <div className={cx("h_cart_button")}>
          <CartButton />
        </div>
        <div className={cx("h_user_button")}>
          <Button
            block
            type="default"
            style={{
              fontSize: "1.5rem",
              boxShadow: "none",
              height: "2rem",
              color: "#127567",
              border: "1px solid #4CAF91",
              fontWeight: "600",
              cursor: "pointer",
              backgroundColor: "#F8F9FA",
            }}
            onClick={() => {
              navigate("/sign_in");
            }}
          >
            <span style={{ fontSize: "1rem" }}>Đăng nhập</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
