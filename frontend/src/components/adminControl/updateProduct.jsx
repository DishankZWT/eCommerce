import "./form.css";
import { useEffect, useState } from "react";
export default function UpdateProductForm() {
  const [categoryData, setCategoryData] = useState(null);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const formData = new FormData();
  const [products, setProducts] = useState({
    id: "",
    name: "",
    price: "",
    category_id: "",
    description: "",
    stock: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((response) => response.json())
      .then((categories) => setCategoryData(categories))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const key in products) {
        formData.append(key, products[key]);
      }
      formData.append("image", image);
      console.log(products.id);

      const response = await fetch(
        `http://localhost:3000/api/products/${products.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );
      await response.json();
      setProducts({
        id: "",
        name: "",
        price: "",
        category_id: "",
        description: "",
        stock: "",
      });
    } catch (error) {
      console.log(error);
      console.log("Error occurred while creating product");
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setProducts({
      ...products,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    e.preventDefault();
    const image = e.target.files[0];

    setImage(image);
  };

  const categoryChange = (e) => {
    handleChange(e);
    setCategory(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Product</h3>
      <label>Product Image</label>
      <input
        type="file"
        key="image"
        name="image"
        onChange={handleFileChange}
        placeholder="Product Image"
      />
      <br />
      <label>Product Id</label>
      <input
        type="number"
        name="id"
        value={products.id}
        onChange={handleChange}
        placeholder="Enter product id"
        required
      />
      <br />
      <label>Product Name</label>
      <input
        type="text"
        name="name"
        value={products.name}
        onChange={handleChange}
        placeholder="Enter product name"
      />
      <br />
      <label>Category</label>
      <select
        onChange={(e) => categoryChange(e)}
        name="category_id"
        value={category}
      >
        <option value="">select category</option>
        {categoryData ? (
          categoryData.map((element) => {
            return (
              <option key={`${element.id}`} value={`${element.id}`}>
                {element.name}
              </option>
            );
          })
        ) : (
          <option value=""></option>
        )}
      </select>
      <label>Product Description</label>
      <input
        type="text"
        name="description"
        value={products.description}
        onChange={handleChange}
        placeholder="Enter product description"
      />
      <br />
      <label>Product Price</label>
      <input
        type="number"
        name="price"
        value={products.price}
        onChange={handleChange}
        placeholder="Enter product price"
      />
      <br />
      <label>Stock</label>
      <input
        type="number"
        name="stock"
        value={products.stock}
        onChange={handleChange}
        placeholder="Enter stock"
      />
      <br />
      <button type="submit">Update Product</button>
    </form>
  );
}
