import React from "react";
import classNames from "classnames/bind";
//picture
import images from "../../../../assets/images";
//icon
import { CiLocationOn } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";
import { FaFacebookSquare } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { SiZalo } from "react-icons/si";
import "../../styleLayout.css";

const cx = classNames.bind();

function Footer() {
  return (
    <footer className={cx("f_wrapper")}>
      <div className={cx("inner f_inner")}>
        <div className={cx("f_logo")}>
          <img className="f_logo_image" src={images.logo1} alt="WeVibe" />
        </div>
        <div className="f_help">
          <div className="ContactInformation">
            <h2>Thông tin liên hệ </h2>
            <a href="./" style={{ wordWrap: "break-word" }}>
              <CiLocationOn /> Trường Đại học Công nghệ Thông tin Đại học Quốc
              gia Thành phố Hồ Chí Minh Khu phố 6, P. Linh Trung, TP. Thủ Đức,
              TP.HCM
            </a>
            <a href="./">
              <FiPhone /> 09099009009
            </a>
            <a href="./">
              <MdMailOutline /> wevibe.bigcompany@gmail.com
            </a>
            <div href="./">
              <a>
                <FaFacebookSquare />
                &emsp;
              </a>
              <a>
                <FiInstagram />
                &emsp;
              </a>
              <a>
                <SiZalo />
              </a>
            </div>
          </div>
          <div className="CustomerService">
            <h2>Chăm sóc khách hàng</h2>
            <a href="./">Trung tâm trợ giúp</a>
            <a href="./">Bảo hành</a>
            <a href="./">Mua hàng</a>
            <a href="./">Thanh Toán</a>
            <a href="./">Vận chuyển</a>
            <a href="./">Mã giảm giá</a>
            <a href="./">Trả và hoàn tiền</a>
            <a href="./">Đánh giá sản phẩm</a>
          </div>
          <div className="TermsofService">
            <h2>Điều khoản - Dịch vụ</h2>
            <a href="./">Điều khoản sử dụng</a>
            <a href="./">Chính sách bảo mật</a>
            <a href="./">Chính sách thanh toán</a>
            <a href="./">Chính sách vận chuyển</a>
            <a href="./">Chính sách xuất hóa đơn</a>
            <a href="./">Chính sách đổi - trả - hoàn tiền</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
