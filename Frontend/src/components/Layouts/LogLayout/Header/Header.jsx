import classNames from "classnames/bind";
import images from "../../../../assets/images";

import MenuSlide from "../../../MenuSlide";
import SearchBar from "../../../SearchBar";
import CartButton from "../../../CartButton";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind();

console.log(images.logo);
function Header() {
  const navigate = useNavigate();
  return (
    <header className={cx("h_wrapper")}>
      <div
        className={cx("inner h_log_inner h_inner")}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className={cx("h_logo")}
          onClick={() => {
            navigate("/");
          }}
        >
          <img className="h_logo_image" src={images.logo} alt="WeVibe" />
        </div>
      </div>
    </header>
  );
}

export default Header;
