// api.js

export const fetchProductData = async () => {
  try {
    const response = await fetch('http://localhost:3000/product/get-all-products', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("APTI lấy data product")
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error; // Propagate the error to handle it in the calling code
  }
};

// Data/api.js

export const fetchPaginatedProductData = async (
  categoryID,
  pageIndex,
  pageSize,
  jwtToken
) => {
  try {
    const apiUrl = `https://localhost:3000/api/Product/public-paging?category_ids=${categoryID}&pageindex=${pageIndex}&pagesize=${pageSize}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching paginated product data:", error);
    throw error;
  }
};

export const fetchCategoryData = async (jwtToken) => {
  try {
    const response = await fetch("https://localhost:3000/api/Category", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};

export const fetchProductDetailData = async (jwtToken, product_id) => {
  try {
    const apiUrl = `https://localhost:3000/api/Product/${product_id}`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error; // Propagate the error to handle it in the calling code
  }
};
