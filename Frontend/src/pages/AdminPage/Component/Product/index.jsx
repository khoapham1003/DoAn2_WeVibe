import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Menu,
  Dropdown,
  DatePicker,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaEdit, FaListUl, FaTags, FaTrash } from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IoMdAdd } from "react-icons/io";
import "./../../../stylePage.css";
import { FiGrid } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
import { BiGridAlt } from "react-icons/bi";

const { Option } = Select;

function ProductAdmin() {
  const [items, setItems] = useState([]);
  const [isCategoryEditModalVisible, setIsCategoryEditModalVisible] =
    useState(false);
  const [isVariantEditModalVisible, setIsVariantEditModal] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [quantity, setQuantity] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [form] = Form.useForm();
  const [formvariant] = Form.useForm();
  const [addForm] = Form.useForm();
  const [formCate] = Form.useForm();
  const { confirm } = Modal;

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
    // fetchProductData();
    fetchCategoryData();
    fetchSizeData();
    fetchColorData();
    fetchProductCategoryData();
  }, []);

  const fetchVariantData = async (productId) => {
    try {
      const response = await fetch(
        ` http://localhost:3000/product-variants/get-by-productId/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        setVariants([]);
      }
      const data = await response.json();
      console.log(data);
      setVariants(data);
    } catch (error) {
      message.error("Không tìm thấy mẫu sản phẩm của sản phẩm này!");
      console.error("Error fetching product data:", error);
      throw error;
    }
  };

  const fetchColorData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/color/get-all-colors",
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
      setColor(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Propagate the error to handle it in the calling code
    }
  };

  const fetchSizeData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/sizes/get-all-sizes",
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
      setSize(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Propagate the error to handle it in the calling code
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/category/get-all-categories",
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
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Propagate the error to handle it in the calling code
    }
  };

  const fetchProductCategoryData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/product/get-all-products-with-categories",
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
      setItems(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw error; // Propagate the error to handle it in the calling code
    }
  };

  const removeProduct = async (ItemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/product/delete-product/${ItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);
      await fetchProductCategoryData();
      message.success("Xóa sản phẩm thành công!");
    } catch (error) {
      message.error("Xóa sản phẩm thất bại!");
      console.error("Error removing item:", error);
    }
  };

  const handleRemoveVariantItem = async (ItemId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/product-variants/delete-productvariant/${ItemId}`,
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
      await fetchVariantData(currentItemId);
      await fetchProductCategoryData();
      message.success("Xóa mẫu sản phẩm thành công!");
    } catch (error) {
      message.error("Xóa mẫu sản phẩm thất bại!");
      console.error("Error removing item:", error);
    }
  };

  const handleRemoveItem = (ItemId) => {
    removeProduct(ItemId);
  };

  const editProduct = async (ItemId, requestBody) => {
    try {
      const response = await fetch(
        `http://localhost:3000/product/update-product/${ItemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductCategoryData();
      message.success("Chỉnh sửa sản phẩm thành công!");
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Chỉnh sửa sản phẩm thất bại!");
      console.error("Error updating product:", error);
    }
  };

  const addProduct = async (requestBody) => {
    try {
      const response = await fetch(
        "http://localhost:3000/product/create-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductCategoryData();

      setIsAddModalVisible(false);

      message.success("Thêm sản phẩm thành công!");
    } catch (error) {
      message.error("Thêm sản phẩm thất bại!");
      console.error("Error adding product:", error);
    }
  };

  const addCateogory = async () => {
    try {
      const requestBody = {
        productId: currentItemId,
        categoryId: selectedCategory.id,
      };
      const response = await fetch(
        "http://localhost:3000/category-product/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductCategoryData();
      message.success("Thêm danh mục vào sản phẩm thành công!");
      formCate.resetFields();
    } catch (error) {
      message.error("Thêm danh mục sản phẩm thất bại!");
      console.error("Error adding product:", error);
    }
  };

  const addVariant = async () => {
    try {
      const requestBody = {
        productId: currentItemId,
        sizeId: selectedSize.id,
        colorId: selectedColor.id,
        quantity: parseInt(quantity),
      };
      const response = await fetch(
        "http://localhost:3000/product-variants/create-productvariant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchProductCategoryData();
      await fetchVariantData(currentItemId);
      message.success("Thêm mẫu sản phẩm thành công!");
      formvariant.resetFields();
    } catch (error) {
      message.error("Thêm mẫu sản phẩm thất bại!");
      console.error("Error adding product:", error);
    }
  };

  const addQuantityProduct = async (quantity) => {
    try {
      const response = await fetch(
        `http://localhost:3000/product/update-product/${currentItemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            quantity: quantity,
          }),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchVariantData(currentItemId);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const showEditForm = (itemId) => {
    setCurrentItemId(itemId);
    const item = items.find((i) => i.id === itemId); // Tìm sản phẩm theo `id` thay vì `product.id`

    if (item) {
      form.setFieldsValue({
        title: item.title || "", // Tên sản phẩm
        slug: item.slug || "", // Slug của sản phẩm
        content: item.content || "", // Nội dung mô tả sản phẩm
        price: item.price || 0, // Giá sản phẩm
        quantity: item.quantity || 0, // Số lượng sản phẩm
        shop: item.shop || false, // Trạng thái shop
        discount: item.discount || 0, // Giảm giá
        startsAt: item.startsAt ? new Date(item.startsAt).toISOString() : null,
        endsAt: item.endsAt ? new Date(item.endsAt).toISOString() : null,
        picture: item.picture || "", // Đường dẫn ảnh
      });
    }

    setIsEditModalVisible(true); // Hiển thị modal chỉnh sửa
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        editProduct(currentItemId, values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const showUpdateCategoryForm = (itemId) => {
    setCurrentItemId(itemId);
    setIsCategoryEditModalVisible(true);
  };

  const handleCategoryEditOk = () => {
    addCateogory();
    setIsCategoryEditModalVisible(false);
  };

  const handleCategoryEditCancel = () => {
    setIsCategoryEditModalVisible(false);
  };

  const showUpdateVariantForm = (itemId) => {
    setCurrentItemId(itemId);
    setIsVariantEditModal(true);
  };

  const handleVariantEditOk = async () => {
    addVariant();
    setIsVariantEditModal(false);
  };

  const handleVariantEditCancel = () => {
    setIsVariantEditModal(false);
  };

  const handleMenuClick = (e) => {
    const selected = categories.find((cat) => cat.id === parseInt(e.key));
    setSelectedCategory(selected);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {categories.map((category) => (
        <Menu.Item key={category.id}>{category.title}</Menu.Item>
      ))}
    </Menu>
  );

  const handleMenuColorClick = (e) => {
    const selected = color.find((cat) => cat.id === parseInt(e.key));
    setSelectedColor(selected);
    form.setFieldsValue({ colorDropdown: selected.name });
  };

  const handleMenuSizeClick = (e) => {
    const selected = size.find((cat) => cat.id === parseInt(e.key));
    setSelectedSize(selected);
    form.setFieldsValue({ sizeDropdown: selected.name });
  };

  const menucolor = (
    <Menu onClick={handleMenuColorClick}>
      {color.map((color) => (
        <Menu.Item key={color.id}>{color.name}</Menu.Item>
      ))}
    </Menu>
  );

  const menusize = (
    <Menu onClick={handleMenuSizeClick}>
      {size.map((size) => (
        <Menu.Item key={size.id}>{size.name}</Menu.Item>
      ))}
    </Menu>
  );

  const toggleDropdown = async (id) => {
    setCurrentItemId(id);
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      if (!variants[id]) {
        await fetchVariantData(id);
      }
      setOpenDropdown(id);
    }
  };

  const showAddForm = () => {
    setIsAddModalVisible(true);
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
          slug: values.slug || "",
          shop: values.shop || false,
          discount: values.discount || 0,
          picture: values.picture || "",
          content: values.content || "",
          quantity: 0,
          startsAt: new Date().toISOString(),
          endsAt: new Date().toISOString(),
        };

        addProduct(payload);
        addForm.resetFields();
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };
  const handleAddCancel = () => {
    setIsAddModalVisible(false);
  };
  const showVariantConfirm = (itemId) => {
    console.log(itemId);
    confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      icon: <ExclamationCircleOutlined />,
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        handleRemoveVariantItem(itemId);
      },
      onCancel() {
        console.log("Hủy bỏ xóa sản phẩm");
      },
    });
  };

  const showConfirm = (itemId) => {
    console.log(itemId);
    confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      icon: <ExclamationCircleOutlined />,
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        handleRemoveItem(itemId);
      },
      onCancel() {
        console.log("Hủy bỏ xóa sản phẩm");
      },
    });
  };

  return (
    <div>
      <Button onClick={showAddForm} className="profilepage_button">
        <IoMdAdd />
        <em />
        <strong>Thêm mới sản phẩm</strong>
      </Button>
      <div className="cop_cartlist_header">
        <Col md={2} offset={1}></Col>
        <Col md={4} offset={1}>
          <h3>Sản phẩm</h3>
        </Col>
        <Col md={2}>
          <h3>Đơn giá</h3>
        </Col>
        <Col md={2} offset={1}>
          <h3>Số lượng</h3>
        </Col>
        <Col md={4} offset={1}>
          <h3>Loại</h3>
        </Col>
      </div>
      <div className="cop_cartlist_item">
        {items.map((item) => (
          <Card className="cop_item_cart" key={item.id}>
            <Row align="middle">
              <Col md={2} offset={1}>
                <Image
                  style={{
                    height: 80,
                    width: 80,
                  }}
                  alt={item.title}
                  src={item.picture}
                />
              </Col>
              <Col md={4} offset={1}>
                <span>{item.title}</span>
              </Col>
              <Col md={2}>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                </span>
              </Col>
              <Col md={2} offset={1}>
                <span>{item.quantity}</span>
              </Col>
              <Col md={4} offset={1}>
                <span className="cop_item_price">
                  {item?.categoryProducts?.length
                    ? item.categoryProducts
                        .filter((cp) => cp.categoryId !== null)
                        .map((cp) => cp.category?.title)
                        .join(", ") || "No categories"
                    : "No categories"}
                </span>
              </Col>

              <Col md={3} offset={1}>
                <span>
                  <Col md={3} offset={1}>
                    <span>
                      <Button
                        className="admin_button"
                        onClick={() => showConfirm(item.id)}
                      >
                        <FaTrash /> Xóa sản phẩm
                      </Button>
                      <Button
                        className="admin_button"
                        onClick={() => showEditForm(item.id)}
                      >
                        <FaEdit /> Chỉnh sửa
                      </Button>
                      <Button
                        className="admin_button"
                        onClick={() => showUpdateCategoryForm(item.id)}
                      >
                        <FaTags /> Chọn danh mục
                      </Button>
                      <Button
                        className="admin_button"
                        onClick={() => showUpdateVariantForm(item.id)}
                      >
                        <BiGridAlt /> Thêm mẫu SP
                      </Button>
                    </span>
                  </Col>
                </span>
              </Col>
              <br></br>
              <Col md={10} style={{ textAlign: "left" }}>
                <Button onClick={() => toggleDropdown(item.id)}>
                  Danh sách mẫu SP
                </Button>
                {openDropdown === item.id && (
                  <div className="dropdown-container">
                    <ul>
                      {variants.length > 0 ? (
                        variants.map((variant) => (
                          <div className="variant-row" key={variant.id}>
                            <span className="variant-color">
                              <b>Màu sắc:</b> {variant.color?.name ?? ""}
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 16,
                                  height: 16,
                                  backgroundColor: variant.color?.hex ?? "",
                                  borderRadius: "50%",
                                  marginLeft: 5,
                                }}
                              ></span>
                            </span>
                            <span className="variant-size">
                              <b>Kích cỡ:</b> {variant.size?.name ?? ""} (
                              {variant.size?.size ?? ""})
                            </span>
                            <span className="variant-quantity">
                              <b>Số lượng:</b> {variant.quantity}
                            </span>
                            <Button
                              className="delete-button"
                              onClick={() => showVariantConfirm(variant.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <li>Không có mẫu có sẵn!</li>
                      )}
                    </ul>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </div>
      <Modal
        title="Chỉnh sửa sản phẩm"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy bỏ"
      >
        <Form form={form} layout="vertical" name="edit_product_form">
          <Form.Item
            name="title"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {/* <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng sản phẩm!" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item> 
           <Form.Item
            name="discount"
            label="Giảm giá (%)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị giảm giá (nếu có)!",
              },
            ]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="startsAt"
            label="Ngày bắt đầu khuyến mãi"
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
          >
            <Input placeholder="YYYY-MM-DDTHH:mm:ss.sssZ" />
          </Form.Item>
          <Form.Item
            name="endsAt"
            label="Ngày kết thúc khuyến mãi"
            rules={[
              { required: true, message: "Vui lòng nhập ngày kết thúc!" },
            ]}
          >
            <Input placeholder="YYYY-MM-DDTHH:mm:ss.sssZ" />
          </Form.Item> */}
          <Form.Item name="picture" label="Hình ảnh sản phẩm (URL)">
            <Input />
          </Form.Item>
          <Form.Item
            name="shop"
            label="Hiển thị trên cửa hàng"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thêm sản phẩm mới"
        visible={isAddModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        okText="Thêm"
        cancelText="Hủy bỏ"
      >
        <Form form={addForm} layout="vertical" name="add_product_form">
          <Form.Item
            name="title"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Mô tả sản phẩm">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          {/* <Form.Item
            name="quantity"
            label="Số lượng trong kho"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng trong kho!" },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item> */}
          {/* <Form.Item
            name="discount"
            label="Giảm giá (%)"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá trị giảm giá (nếu có)!",
              },
            ]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="startsAt"
            label="Ngày bắt đầu khuyến mãi"
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
          >
            <Input placeholder="YYYY-MM-DDTHH:mm:ss.sssZ" />
          </Form.Item>
          <Form.Item
            name="endsAt"
            label="Ngày kết thúc khuyến mãi"
            rules={[
              { required: true, message: "Vui lòng nhập ngày kết thúc!" },
            ]}
          >
            <Input placeholder="YYYY-MM-DDTHH:mm:ss.sssZ" />
          </Form.Item> */}
          <Form.Item name="picture" label="Hình ảnh sản phẩm (URL)">
            <Input />
          </Form.Item>
          <Form.Item
            name="shop"
            label="Hiển thị trên cửa hàng"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chỉnh sửa danh mục cho sản phẩm"
        visible={isCategoryEditModalVisible}
        onOk={handleCategoryEditOk}
        onCancel={handleCategoryEditCancel}
        okText="Lưu"
        cancelText="Hủy bỏ"
      >
        <Form form={formCate} layout="vertical" name="edit_category_form">
          <Form.Item
            name="categoryDropdown"
            label="Chọn danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Dropdown overlay={menu} trigger={["click"]}>
              <Input
                value={
                  selectedCategory ? selectedCategory.title : "Chọn danh mục"
                }
                readOnly
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm mẫu sản phẩm"
        visible={isVariantEditModalVisible}
        onOk={handleVariantEditOk}
        onCancel={handleVariantEditCancel}
        okText="Lưu"
        cancelText="Hủy bỏ"
      >
        <Form layout="vertical" form={formvariant} name="edit_variant_form">
          <Form.Item
            name="colorDropdown"
            label="Chọn color"
            rules={[{ required: true, message: "Vui lòng chọn color!" }]}
          >
            <Dropdown overlay={menucolor} trigger={["click"]}>
              <Input
                value={selectedColor ? selectedColor.name : "Chọn color"}
                readOnly
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          </Form.Item>

          <Form.Item
            name="sizeDropdown"
            label="Chọn size"
            rules={[{ required: true, message: "Vui lòng chọn size!" }]}
          >
            <Dropdown overlay={menusize} trigger={["click"]}>
              <Input
                value={selectedSize ? selectedSize.name : "Chọn size"}
                readOnly
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Nhập số lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng!" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập số lượng"
              onChange={(value) => setQuantity(value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ProductAdmin;
