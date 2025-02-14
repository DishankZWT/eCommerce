/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./categories.css";
import ProductCard from "./cards/ProductCard";
// import Card from "./cards/card";

export default function Products({ role }) {
  const [categoryData, setCategoryData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/categories")
      .then((response) => response.json())
      .then((categories) => setCategoryData(categories))
      .catch((error) => console.error("Error:", error));
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((products) => setProductData(products))
      .catch((error) => console.error("Error:", error));
  }, []);
  const handleFilterChange = () => {
    const queryParams = [];

    if (category) queryParams.push(`cId=${category}`);
    if (minPrice) queryParams.push(`minPrice=${minPrice}`);
    if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
    if (stock) queryParams.push(`stockGt=${stock}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    fetch(`http://localhost:3000/api/products${queryString}`)
      .then((response) => response.json())
      .then((products) => setProductData(products))
      .catch((error) => {
        console.error("Error fetching filtered products:", error);
      });
  };

  return (
    <>
      <h1>product filters</h1>
      <br />
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
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

      <div>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button onClick={handleFilterChange}>Filter</button>
      </div>
      <br />
      <h1>products:</h1>
      <br />
      <div className="products">
        {productData ? (
          productData.map((element) => {
            return (
              <ProductCard
                path={element.image_url}
                name={element.name}
                description={element.description}
                stock={element.stock}
                price={element.price}
                key={`${element.id}`}
                productId={`${element.id}`}
                role={role}
              ></ProductCard>
            );
          })
        ) : (
          <p>no product matches your filter</p>
        )}
      </div>
    </>
  );
}
