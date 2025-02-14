import { useState, useEffect } from "react";
import WishlistCard from "../cards/wishlistCard";

export default function Wishlist() {
  const [wishlistData, setWishlistData] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/wishlist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((wishlist) => {
        setWishlistData(wishlist);
        const productIds = wishlist.map((item) => item.product_id);
        fetchProducts(productIds);
      })
      .catch((error) => console.error("Error fetching wishlist:", error));
  }, []);

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

  return (
    <>
      <h1>Your Wishlist:</h1>
      <div className="wishlist-items">
        {wishlistData && productData ? (
          wishlistData.map((element, index) => (
            <WishlistCard
              key={element.id}
              userId={element.user_id}
              product={productData[index]}
            />
          ))
        ) : (
          <p>your wishlist is empty</p>
        )}
      </div>
    </>
  );
}
