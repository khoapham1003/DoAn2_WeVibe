import classNames from "classnames/bind";
import images from "../../../../assets/images";
import MenuSlide from "../../../MenuSlide";
import SearchBar from "../../../SearchBar";
import CartButton from "../../../CartButton";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

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
          <img
            className="h_logo_image"
            src={images.logo}
            alt="1015 BookStore"
          />
        </div>
        <div className={cx("h_search_bar")}>
          <SearchBar />
        </div>
        <div className={cx("h_cart_button")}>
          <CartButton />
        </div>
        <div className={cx("h_login_button")}>
          <Button
            className="button"
            block
            type="default"
            style={{
              height: "4vh",
              width: "8vw",
            }}
            onClick={() => {
              navigate("/sign_in");
            }}
          >
            <span style={{ fontSize: "2vh" }}>Đăng nhập</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
