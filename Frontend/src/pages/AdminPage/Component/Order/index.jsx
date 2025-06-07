import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { DatePicker, Space, Button, Select } from "antd";
import { Card, Row, Descriptions, Tabs } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const { Option } = Select;
const { TabPane } = Tabs;

function OrderAdmin() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState({ pending: [], complete: [] });
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [chartType, setChartType] = useState("daily");
  const [dataType, setDataType] = useState("totalPrice");

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
  const userId = getCookie("userid");
  const jwtToken = getCookie("accessToken");
  useEffect(() => {
    fetchProductData();
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/orders/order-pending`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.data);
      let orderdata = data.data;

      let pendingOrders = orderdata.filter(
        (order) => order.status === "PENDING"
      );
      let completeOrders = orderdata.filter(
        (order) => order.status === "COMPLETED"
      );
      pendingOrders = pendingOrders.sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );
      completeOrders = completeOrders.sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );
      console.log(pendingOrders, completeOrders);

      setOrders({ pending: pendingOrders, complete: completeOrders });
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/orders/order-statistics`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.data);
      setItems(data.data);
      //  processChartData(data.data, startDate, endDate);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  };
  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/orders/order-statistics1?startDate=${
          startDate?.toISOString().split("T")[0]
        }&endDate=${endDate?.toISOString().split("T")[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      processChartData(data, startDate, endDate);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      console.log("Fetching orders with dates:", startDate, endDate);
      fetchProductData();
      fetchChartData();
    }
  }, [startDate, endDate]);

  const processChartData = (orders, startDate, endDate) => {
    const dailySales = getDatesBetween(startDate, endDate);
    const monthlySales = getMonthsBetween(startDate, endDate);
    const yearlySales = getYearsBetween(startDate, endDate);

    const dailyOrders = getDatesBetween(startDate, endDate);
    const monthlyOrders = getMonthsBetween(startDate, endDate);
    const yearlyOrders = getYearsBetween(startDate, endDate);

    const dailyProducts = getDatesBetween(startDate, endDate);
    const monthlyProducts = getMonthsBetween(startDate, endDate);
    const yearlyProducts = getYearsBetween(startDate, endDate);

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const day = date.toISOString().split("T")[0];
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const year = `${date.getFullYear()}`;

      if (dailySales[day] !== undefined) dailySales[day] += order.totalPrice;
      if (monthlySales[month] !== undefined)
        monthlySales[month] += order.totalPrice;
      if (yearlySales[year] !== undefined)
        yearlySales[year] += order.totalPrice;

      if (dailyOrders[day] !== undefined) dailyOrders[day] += 1;
      if (monthlyOrders[month] !== undefined) monthlyOrders[month] += 1;
      if (yearlyOrders[year] !== undefined) yearlyOrders[year] += 1;

      order.orderItems.forEach((item) => {
        if (dailyProducts[day] !== undefined) dailyProducts[day] += item.amount;
        if (monthlyProducts[month] !== undefined)
          monthlyProducts[month] += item.amount;
        if (yearlyProducts[year] !== undefined)
          yearlyProducts[year] += item.amount;
      });
    });

    setChartData({
      daily: {
        labels: Object.keys(dailySales),
        datasets: [
          {
            label: "Tổng Giá Trị Bán Ra (Theo Ngày)",
            data: Object.values(dailySales),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Đơn Hàng Bán Ra (Theo Ngày)",
            data: Object.values(dailyOrders),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Sản Phẩm Bán Ra (Theo Ngày)",
            data: Object.values(dailyProducts),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      monthly: {
        labels: Object.keys(monthlySales),
        datasets: [
          {
            label: "Tổng Giá Trị Bán Ra (Theo Tháng)",
            data: Object.values(monthlySales),
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Đơn Hàng Bán Ra (Theo Tháng)",
            data: Object.values(monthlyOrders),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Sản Phẩm Bán Ra (Theo Tháng)",
            data: Object.values(monthlyProducts),
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      yearly: {
        labels: Object.keys(yearlySales),
        datasets: [
          {
            label: "Tổng Giá Trị Bán Ra (Theo Năm)",
            data: Object.values(yearlySales),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Đơn Hàng Bán Ra (Theo Năm)",
            data: Object.values(yearlyOrders),
            backgroundColor: "rgba(255, 206, 86, 0.6)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
          {
            label: "Số Lượng Sản Phẩm Bán Ra (Theo Năm)",
            data: Object.values(yearlyProducts),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    });
  };
  const getDatesBetween = (startDate, endDate) => {
    const dates = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      dates[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getMonthsBetween = (startDate, endDate) => {
    const months = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthStr = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }`;
      months[monthStr] = 0;
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
  };

  const getYearsBetween = (startDate, endDate) => {
    const years = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const yearStr = `${currentDate.getFullYear()}`;
      years[yearStr] = 0;
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    return years;
  };

  const handleStartDateChange = (date) => {
    console.log("Start date selected:", date);
    setStartDate(date ? date.startOf("day").toDate() : null);
  };

  const handleEndDateChange = (date) => {
    console.log("End date selected:", date);
    setEndDate(date ? date.endOf("day").toDate() : null);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleDataTypeChange = (type) => {
    setDataType(type);
  };

  const handleCardClick = (item) => {
    console.log("Card clicked:", item);
    localStorage.setItem("orderconfirmId", item.id);
    navigate("/confirmorder/" + item.id);
  };

  return (
    <div>
      <h2 className="detail-h2">
        <span className="title-holder">Thông Số Bán Hàng</span>
      </h2>
      <div className="admin-info">
        <div className="admin-info-totalSale">
          <h3>Tổng giá trị bán ra:</h3>   {" "}
          <span>
            {new Intl.NumberFormat("vi-VN").format(items?.totalGrandTotal || 0)}
            đ
          </span>
        </div>
        <div className="admin-info-totalOrder">
          <h3>Tổng đơn hàng:</h3>
          <span>{items?.totalOrders || 0}</span>
        </div>
        <div className="admin-info-totalProduct">
          <h3>Tổng số lượng sản phẩm bán ra:</h3>
          <span>{items?.totalQuantity || 0}</span>
        </div>
      </div>
      <h2 className="detail-h2">
        <span className="title-holder">Biểu Đồ Tổng Giá Trị Bán Ra</span>
      </h2>
      <div className="chart-part">
        <div className="type-of-chart">
          <Space className="chart-by-day" size={12}>
            <h2>Lọc theo ngày</h2>
            <Button
              className="chart-button"
              onClick={() => handleChartTypeChange("daily")}
            >
              Theo Ngày
            </Button>
            <Space className="chart-datepicker">
              <DatePicker
                placeholder="Chọn ngày bắt đầu"
                onChange={handleStartDateChange}
                format="YYYY-MM-DD"
              />
              <DatePicker
                placeholder="Chọn ngày kết thúc"
                onChange={handleEndDateChange}
                format="YYYY-MM-DD"
              />
            </Space>
            <h2>Chọn giá trị để lọc theo ngày</h2>
            <Space className="chart-by-value">
              <Button
                className="chart-button"
                onClick={() => handleDataTypeChange("totalPrice")}
              >
                Tổng Giá Trị
              </Button>
              <Button
                className="chart-button"
                onClick={() => handleDataTypeChange("orderCount")}
              >
                Số Lượng Đơn Hàng
              </Button>
              <Button
                className="chart-button"
                onClick={() => handleDataTypeChange("productCount")}
              >
                Số Lượng Sản Phẩm
              </Button>
            </Space>
          </Space>

          <Space className="chart-by-monthyear">
            <h2>Hoặc lựa chọn lọc theo Tháng/Năm</h2>
            <Button
              className="chart-button"
              onClick={() => handleChartTypeChange("monthly")}
            >
              Theo Tháng
            </Button>
            <Button
              className="chart-button"
              onClick={() => handleChartTypeChange("yearly")}
            >
              Theo Năm
            </Button>
          </Space>
        </div>
        {chartType === "daily" && chartData.daily && (
          <div className="chart-container">
            <h2>Theo Ngày</h2>
            <Bar
              data={{
                labels: chartData.daily.labels,
                datasets: [
                  dataType === "totalPrice" && {
                    label: "Tổng Giá Trị Bán Ra (Theo Ngày)",
                    data: chartData.daily.datasets[0].data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                  dataType === "orderCount" && {
                    label: "Số Lượng Đơn Hàng Bán Ra (Theo Ngày)",
                    data: chartData.daily.datasets[1].data,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                  },

                  dataType === "productCount" && {
                    label: "Số Lượng Sản Phẩm Bán Ra (Theo Ngày)",
                    data: chartData.daily.datasets[2].data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                ].filter(Boolean),
              }}
            />
          </div>
        )}
        {chartType === "monthly" && chartData.monthly && (
          <div className="chart-container">
            <h2>Theo Tháng</h2>
            <Bar
              data={{
                labels: chartData.monthly.labels,
                datasets: [
                  dataType === "totalPrice" && {
                    label: "Tổng Giá Trị Bán Ra (Theo Tháng)",
                    data: chartData.monthly.datasets[0].data,
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1,
                  },
                  dataType === "orderCount" &&  {
                    label: "Số Lượng Đơn Hàng Bán Ra (Theo Tháng)",
                    data: chartData.monthly.datasets[1].data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                  dataType === "productCount" && {
                    label: "Số Lượng Sản Phẩm Bán Ra (Theo Tháng)",
                    data: chartData.monthly.datasets[2].data,
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                  },
                ].filter(Boolean),
              }}
            />
          </div>
        )}

        {chartType === "yearly" && chartData.yearly && (
          <div className="chart-container">
            <h2>Theo Năm</h2>
            <Bar
              data={{
                labels: chartData.yearly.labels,
                datasets: [
                  dataType === "totalPrice" &&   {
                    label: "Tổng Giá Trị Bán Ra (Theo Năm)",
                    data: chartData.yearly.datasets[0].data,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                  },
                  dataType === "orderCount" &&   {
                    label: "Số Lượng Đơn Hàng Bán Ra (Theo Năm)",
                    data: chartData.yearly.datasets[1].data,
                    backgroundColor: "rgba(255, 206, 86, 0.6)",
                    borderColor: "rgba(255, 206, 86, 1)",
                    borderWidth: 1,
                  },
                  dataType === "productCount" &&   {
                    label: "Số Lượng Sản Phẩm Bán Ra (Theo Năm)",
                    data: chartData.yearly.datasets[2].data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ].filter(Boolean),
              }}
            />
          </div>
        )}
      </div>

      <h2 className="detail-h2">
        <span className="title-holder">Giao Dịch Gần Đây</span>
      </h2>

      <div
        className="order-history"
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Đang chờ xử lý" key="1">
            {orders.pending.length > 0 ? (
              orders.pending.map((item) => (
                <Card
                  key={item.id}
                  className="order_history_cart"
                  bodyStyle={{ padding: "5px 3vw 0px" }}
                  onClick={() => handleCardClick(item)}
                  hoverable
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên người nhận">
                      {item.address.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="SĐT">
                      {item.address.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ nhận hàng">
                      {item.address.line1 +
                        ", " +
                        (item.address.line2 ? item.address.line2 + ", " : "") +
                        item.address.city +
                        ", " +
                        item.address.province +
                        ", " +
                        item.address.country}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đơn hàng">
                      {new Intl.NumberFormat("vi-VN").format(item.grandTotal)} đ
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ))
            ) : (
              <p>No pending orders.</p>
            )}
          </TabPane>

          <TabPane tab="Đã hoàn thành" key="2">
            {orders.complete.length > 0 ? (
              orders.complete.map((item) => (
                <Card
                  key={item.id}
                  className="order_history_cart"
                  bodyStyle={{ padding: "5px 3vw 0px" }}
                  hoverable
                  onClick={() => handleCardClick(item)}
                >
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên người nhận">
                      {item.address.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="SĐT">
                      {item.address.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ nhận hàng">
                      {item.address.line1 +
                        ", " +
                        (item.address.line2 ? item.address.line2 + ", " : "") +
                        item.address.city +
                        ", " +
                        item.address.province +
                        ", " +
                        item.address.country}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng đơn hàng">
                      {new Intl.NumberFormat("vi-VN").format(item.grandTotal)} đ
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              ))
            ) : (
              <p>No complete orders.</p>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default OrderAdmin;
