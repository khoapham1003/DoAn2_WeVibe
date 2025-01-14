import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, List, Card, Image, Modal, Input, Radio } from "antd";
import { message } from "antd";
import { ethers } from "ethers";
import contractABI from "../../components/Contracts/contractABI.json"; // Đảm bảo bạn lưu ABI vào file JSON

const rawContractAddress = "0x2514F58f641d199E2F14d641d77100E053996497";
function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const paymentMethods = [
    { key: "COD", label: "Thanh toán khi nhận hàng (COD)" },
    { key: "blockchain", label: "Thanh toán bằng Blockchain Token" },
  ];

  const [items, setItems] = useState([]);
  const [order, setOrder] = useState({
    lastName: "Lương Lê",
    middleName: "Duy",
    firstName: "Tiến",
    phoneNumber: "0123456789",
    email: "tien1214@gmail.com", //
    line1: "1015",
    line2: "",
    city: "TP Ho Chi Minh",
    province: "TP Ho Chi Minh",
    country: "Viet Nam",
  });
  const [promotionalCode, setPromotionalCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(30000);
  const [showConfirmation, setShowConfirmation] = useState(false);
  //const [showConfirmationPay, setShowConfirmationPay] = useState(false);
  const [isApply, setisApply] = useState(false);
  const [isCheck, setisCheck] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [balance, setBalance] = useState("0"); // Số dư token của người dùng
  const [blockNumber, setBlockNumber] = useState(null); // Số khối hiện tại
  const [userAddress, setUserAddress] = useState(""); // Địa chỉ ví của người dùng
  const [showConfirmationPay, setShowConfirmationPay] = useState(false);

  const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };

  const orderId = getCookie("orderId");
  const jwtToken = getCookie("accessToken");
  const userId = getCookie("userid");
  const cartId = getCookie("CartId");
  const cartitemsId = getCookie("cartitemsId");

  let contractAddress;
  try {
    contractAddress = ethers.getAddress(rawContractAddress);
  } catch (error) {
    console.error("Địa chỉ hợp đồng không hợp lệ:", error.message);
    message.error("Địa chỉ hợp đồng không hợp lệ!");
  }

  useEffect(() => {
    fetchCheckOutData();
  }, []);

  const fetchBlockchainInfo = async () => {
    try {
      // Kết nối với mạng BuildBear qua JsonRpcProvider
      const provider = new ethers.JsonRpcProvider(
        "https://rpc.buildbear.io/cooperative-omegared-0720832f"
      );

      // Lấy số khối mới nhất
      const latestBlock = await provider.getBlockNumber();
      setBlockNumber(latestBlock);
      console.log("Số khối mới nhất:", latestBlock);

      // Kết nối với MetaMask và lấy thông tin ví
      if (window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner(); // Lấy signer từ MetaMask
        const address = await signer.getAddress(); // Lấy địa chỉ ví
        setUserAddress(address);
        console.log("Địa chỉ ví người dùng:", address);

        // Khởi tạo hợp đồng
        if (contractAddress) {
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            provider
          );
          console.log("Hợp đồng:", address);
          const balance = await contract.balanceOf(
            "0xD6D44D446C93542B604e7C189747c70B3a0Ff217"
          );
          setBalance(ethers.formatUnits(balance, 18));
          console.log("Số dư token:", ethers.formatUnits(balance, 18));
        }
      } else {
        message.error("Vui lòng cài đặt MetaMask!");
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi kết nối blockchain:", error.message);
      message.error("Không thể lấy thông tin blockchain.");
    }
  };

  // Xử lý thanh toán
  const handlePaymentWithBlockchain = async () => {
    try {
      if (!window.ethereum) {
        message.error("Vui lòng cài đặt MetaMask!");
        return;
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Địa chỉ nhận thanh toán
      const recipientAddress = "0xe72b366514f3DA2B2C3379B0136770bbd92E7413";

      const tokenToSend = (totalPrice / 1000).toString();
      const amountToSend = ethers.parseUnits(tokenToSend, 18);

      if (parseFloat(balance) < parseFloat(tokenToSend)) {
        message.error("Số dư không đủ để thực hiện giao dịch.");
        return;
      }

      // Thực hiện giao dịch
      const tx = await contract.transfer(recipientAddress, amountToSend);
      console.log("Giao dịch đã tạo:", tx);
      message.info("Giao dịch đang được xử lý...");
      await tx.wait(); // Chờ giao dịch được xác nhận
      message.success(`Đã thanh toán thành công!`);
      const transactionData = {
        orderId: parseInt(orderId), // Cập nhật với ID đơn hàng thực tế
        amount: parseFloat(tokenToSend),
        paymentMethodType: "Blockchain",
        status: "SUCCESS",
        paymentDetails: JSON.stringify({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          gasLimit: tx.gasLimit.toString(),
          gasPrice: tx.gasPrice.toString(),
        }),
      };

      const response = await fetch(
        "http://localhost:3000/transaction/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(transactionData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Giao dịch đã được lưu:", result);
      } else {
        console.error("Lỗi khi lưu giao dịch:", await response.text());
      }
      await handlePayment();
      setShowConfirmationPay(false);
      navigate(`/`);
    } catch (error) {
      console.error("Lỗi khi thực hiện thanh toán:", error.message);
      message.error("Thanh toán không thành công.");
    }
  };

  const fetchCheckOutData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/order-item/orderdata/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setItems(data);
      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  const calculateTotalPrice = () => {
    return items.reduce(
      (total, item) =>
        total + item.productVariant.product.price * item.quantity,
      0
    );
  };

  const calculateTotalDiscount = () => {
    let totalDiscount = 0;
    items.forEach((item) => {
      if (item.productVariant.product.discount > 0) {
        totalDiscount +=
          (item.productVariant.product.price *
            item.quantity *
            item.productVariant.product.discount) /
          100;
      }
    });
    return totalDiscount;
  };

  let totalPrice = calculateTotalPrice();

  const calculateTotalPayment = () => {
    totalPrice *= 1 - voucherDiscount / 100;
    totalPrice += shippingFee;
    totalPrice -= calculateTotalDiscount();
    return totalPrice;
  };

  const handlePayment = async () => {
    try {
      const data = {
        lastName: order.lastName,
        middleName: order.middleName,
        firstName: order.firstName,
        phoneNumber: order.phoneNumber,
        email: order.email,
        line1: order.line1,
        line2: order.line2,
        city: order.city,
        province: order.province,
        country: order.country,
        status: "PENDING",
        subTotal: totalPrice,
        totalDiscount: calculateTotalDiscount(),
        shippingFee: shippingFee,
        grandTotal: calculateTotalPayment(),
      };
      console.log(data);
      const response = await fetch(
        `http://localhost:3000/orders/${cartId}/${orderId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      message.success(`Đặt hàng thành công.`);
      const cartitemsArray = cartitemsId
        .split(",")
        .map((item) => parseInt(item, 10));
      for (const cartItemId of cartitemsArray) {
        await removeCartItem(cartItemId);
      }
      setShowConfirmationPay(false);
      await navigate("/");
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentMethod === "COD") {
      handlePayment();
      message.success("Bạn đã chọn Thanh toán khi nhận hàng (COD).");
    } else if (selectedPaymentMethod === "blockchain") {
      fetchBlockchainInfo();
      handlePaymentWithBlockchain();
      setShowConfirmationPay(true); // Mở modal thanh toán blockchain
    }
  };

  const removeCartItem = async (cartItemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/cartitem/delete-cartitem/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchCartData(userId);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleApplyVoucher = () => {
    if (isCheck) {
      setShowConfirmation(true);
    } else {
      message.error(`Xin vui lòng xác thực mã giảm giá trước khi áp dụng!`);
    }
  };
  const handleConfirmApplyVoucher = () => {
    setisApply(true);
    setShowConfirmation(false);
  };

  const handleCancelApplyVoucher = () => {
    setShowConfirmation(false);
  };

  const handleCancelPayment = () => {
    setShowConfirmationPay(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  return (
    <div>
      <h3 class="title-comm">
        <span class="title-holder">ĐẶT HÀNG</span>
      </h3>
      <div className="cop_container">
        <div className="recipient_info">
          <div style={{ padding: "20px" }}>
            <h2>Thông tin người nhận</h2>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label>Họ:</label>
                <input
                  type="text"
                  name="lastName"
                  value={order.lastName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Tên đệm:</label>
                <input
                  type="text"
                  name="middleName"
                  value={order.middleName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Tên:</label>
                <input
                  type="text"
                  name="firstName"
                  value={order.firstName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Số điện thoại, Email */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={order.phoneNumber}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={order.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Địa chỉ 1, Địa chỉ 2 */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label>Địa chỉ 1:</label>
                <input
                  type="text"
                  name="line1"
                  value={order.line1}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Địa chỉ 2 (tùy chọn):</label>
                <input
                  type="text"
                  name="line2"
                  value={order.line2}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Thành phố, Tỉnh, Quốc gia */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label>Thành phố:</label>
                <input
                  type="text"
                  name="city"
                  value={order.city}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Tỉnh:</label>
                <input
                  type="text"
                  name="province"
                  value={order.province}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Quốc gia:</label>
                <input
                  type="text"
                  name="country"
                  value={order.country}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cop_cartlist_header">
          <Col md={1} offset={2}></Col>
          <Col md={3}>
            <h3>Sản phẩm</h3>
          </Col>
          <Col md={2} offset={2}>
            <h3>Kích Thước</h3>
          </Col>
          <Col md={2} offset={1}>
            <h3>Color</h3>
          </Col>
          <Col md={3} offset={0}>
            <h3>Đơn giá</h3>
          </Col>
          <Col md={2}>
            <h3>Số lượng</h3>
          </Col>
          <Col md={3} offset={1}>
            <h3>Thành tiền</h3>
          </Col>
        </div>
        <div className="cop_cartlist_item">
          {items.map((item) => (
            <Card className="cop_item_cart" key={item._id}>
              <Row align="middle">
                <Col md={1} offset={2}>
                  <Image
                    style={{
                      height: 80,
                      width: 80,
                    }}
                    alt={item.productVariant.product.title}
                    src={item.productVariant.product.picture}
                  />
                </Col>
                <Col md={4}>
                  <span>{item.productVariant.product.title}</span>
                </Col>
                <Col md={3}>
                  <span>{item.productVariant.size.name} </span>
                </Col>
                <Col md={3}>
                  <span> {item.productVariant.color.name}</span>
                </Col>
                <Col md={3}>
                  <span>
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(
                        item.productVariant.product.price
                      )}
                      đ
                    </span>
                  </span>
                </Col>
                <Col md={2}>
                  <span>{item.quantity}</span>
                </Col>
                <Col md={4}>
                  <span className="cop_item_price">
                    <span>
                      {new Intl.NumberFormat("vi-VN").format(
                        item.productVariant.product.price * item.quantity
                      )}
                      đ
                    </span>
                  </span>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
        <div className="cop_checkout_info">
          <List>
            <h2>Thanh toán</h2>
            <List.Item>
              <span>
                Tổng tiền hàng:{" "}
                {new Intl.NumberFormat("vi-VN").format(totalPrice)}đ
              </span>
            </List.Item>
            <List.Item>
              <span>
                Phí vận chuyển:{" "}
                {new Intl.NumberFormat("vi-VN").format(shippingFee)}đ
              </span>
            </List.Item>
            <List.Item>
              <span>
                Tổng giảm giá:{" "}
                {new Intl.NumberFormat("vi-VN").format(
                  calculateTotalDiscount()
                )}
                đ
              </span>
            </List.Item>
            <List.Item>
              <span style={{ fontWeight: "500", fontStyle: "italic" }}>
                Tổng thanh toán:{" "}
                {new Intl.NumberFormat("vi-VN").format(calculateTotalPayment())}
                đ
              </span>
            </List.Item>
            <List.Item
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <h2>Phương thức thanh toán</h2>
              <List
                dataSource={paymentMethods}
                renderItem={(method) => (
                  <List.Item>
                    <Radio
                      value={method.key}
                      checked={selectedPaymentMethod === method.key}
                      onChange={handlePaymentMethodChange}
                    >
                      {method.label}
                    </Radio>
                  </List.Item>
                )}
              />
            </List.Item>
            <List.Item>
              <Button
                className="cop_button1"
                style={{ width: "150px" }}
                onClick={() => {
                  if (
                    order.firstName &&
                    order.middleName &&
                    order.lastName &&
                    order.line1 &&
                    order.email &&
                    order.phoneNumber &&
                    order.city &&
                    order.country &&
                    order.province
                  ) {
                    if (
                      order.phoneNumber.length !== 10 ||
                      order.phoneNumber[0] !== "0"
                    ) {
                      message.error(
                        "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0"
                      );
                    } else {
                      if (!promotionalCode) {
                        setShowConfirmationPay(true);
                      } else if (isApply) {
                        setShowConfirmationPay(true);
                      } else {
                        message.error("Vui lòng xác nhận voucher!");
                      }
                    }
                  } else {
                    message.error("Vui lòng nhập đầy đủ thông tin người nhận!");
                  }
                }}
                disabled={!selectedPaymentMethod}
              >
                Thanh toán
              </Button>
            </List.Item>
          </List>
        </div>
      </div>
      {contextHolder}
      <Modal
        visible={showConfirmationPay}
        onOk={handleConfirmPayment}
        onCancel={handleCancelPayment}
      >
        <p>Bạn có chắc muốn thanh toán?</p>
      </Modal>
      <Modal
        visible={showConfirmation}
        onOk={handleConfirmApplyVoucher}
        onCancel={handleCancelApplyVoucher}
      >
        <p>Bạn có chắc muốn áp dụng voucher?</p>
      </Modal>
    </div>
  );
}

export default CheckoutPage;
