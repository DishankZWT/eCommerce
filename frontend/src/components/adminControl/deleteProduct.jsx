import { useEffect, useState } from "react";
import "../categories.css";
export default function DeleteProductForm() {
  const [productData, setProductData] = useState(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      await response.json();
      await getProducts();
    } catch (error) {
      console.log(error);
    }
  };

  async function getProducts() {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((products) => setProductData(products))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>product id</th>
            <th>product name</th>
            <th>stock left</th>
            <th>delete product</th>
          </tr>
        </thead>
        <tbody>
          {productData ? (
            productData.map((element) => {
              return (
                <tr key={element.id}>
                  <td>{element.id}</td>
                  <td>{element.name}</td>
                  <td>{element.stock}</td>
                  <td>
                    <a href="#" onClick={() => handleDelete(element.id)}>
                      delete
                    </a>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
