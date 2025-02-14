/* eslint-disable react/prop-types */
import "./card.css";

export default function WishlistCard({ product }) {
  if (!product) {
    return <div>Loading product...</div>;
  }
  return (
    <div className="card">
      <img
        src={`http://localhost:3000/images/${product.product.image_url}`}
        alt="product image"
      />
      <div className="content">
        <p>Name: {product.product.name}</p>
        <p>{product.product.description}</p>
        <p>Price: {product.product.price}</p>
        <p>Items Left: {product.product.stock}</p>
      </div>
    </div>
  );
}
