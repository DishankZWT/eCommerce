import { useState, useEffect } from "react";
import Card from "../cards/card";
import WishlistCard from "../cards/wishlistCard";

export default function Cart() {
  const [cartData, setCartData] = useState([]);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    getCartItems();
  }, []);

  async function getCartItems() {
    fetch("http://localhost:3000/api/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((cart) => {
        setCartData(cart);
        const productIds = cart.map((item) => item.product_id);
        fetchProducts(productIds);
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }

  const fetchProducts = (productIds) => {
    const requests = productIds.map((id) =>
      fetch(`http://localhost:3000/api/products/${id}`).then((response) =>
        response.json()
      )
    );

    Promise.all(requests)
      .then((products) => setProductData(products))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handleDelete = async (e) => {
    const inputId = e.target.attributes.value.value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/cart/${inputId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      await response.json();
      await getCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  async function placeOrder() {
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      await response.json();
      await getCartItems();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>Your Cart:</h1>
      <a style={{ cursor: "pointer" }} onClick={placeOrder}>
        <Card name="place order"></Card>
      </a>
      <div className="cart-items">
        {cartData.length != 0 && productData ? (
          cartData.map((element, index) => (
            <>
              <WishlistCard
                key={element.id}
                userId={element.user_id}
                product={productData[index]}
              />
              <a
                onClick={handleDelete}
                style={{ cursor: "pointer" }}
                value={element.product_id}
              >
                remove from cart
              </a>
            </>
          ))
        ) : (
          <p>your cart is empty</p>
        )}
      </div>
    </>
  );
}
