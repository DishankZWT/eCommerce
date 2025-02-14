/* eslint-disable react/prop-types */
import "./card.css";

export default function Card(props) {
  return (
    <div className="card">
      <p>{props.name}</p>
    </div>
  );
}
