/* eslint-disable react/prop-types */
import { useState } from "react";
import "./productCard.css";

export default function ProductCard(props) {
  const [isChecked, setIsChecked] = useState(false);

  async function addToWishlist(props) {
    try {
      const dataBody = {};
      dataBody.productId = props.productId;

      const response = await fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(dataBody),
      });
      await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function removeFromWishlist(props) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/wishlist/${props.productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  const handleWishlist = (e) => {
    setIsChecked(e.target.checked);
    {
      isChecked ? removeFromWishlist(props) : addToWishlist(props);
    }
  };

  const handleCart = async () => {
    try {
      const dataBody = {};
      dataBody.product_id = props.productId;

      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(dataBody),
      });
      await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <br />
      <div>
        <label htmlFor="wishlistId">add to wishlist </label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleWishlist}
          id="wishlistId"
        />
      </div>
      <br />
      <br />
      <img
        src={`http://localhost:3000/images/${props.path}`}
        alt="product image"
      />
      <div className="content">
        <p>name: {props.name}</p>
        <p>{props.description}</p>
        <p>price: {props.price}</p>
        <p>items left: {props.stock}</p>
        {props.role == "customer" ? (
          <>
            <br />
            <a onClick={handleCart} style={{ cursor: "pointer" }}>
              add to cart
            </a>
            <br />
          </>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
