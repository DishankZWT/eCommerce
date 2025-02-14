import { useState, useEffect } from "react";
import OrderDetails from "./OrderDetails";

export default function Orders() {
  const [orderData, setOrderData] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((orders) => setOrderData(orders))
      .catch((error) => console.error("Error:", error));
  }, []);

  const showOrderDetails = (e) => {
    const input = e.target.attributes.value.value;
    setActive(input);
  };

  return (
    <div>
      {orderData ? (
        orderData.data.map((element) => {
          return (
            <>
              <br />
              <div key={element.id} className="card">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={showOrderDetails}
                  value={element.id}
                >
                  order: ORDECM{element.id}
                </a>
                <p>order status: {element.status}</p>
                <p>total price: {element.total_price}</p>
                {active == element.id && <OrderDetails id={element.id} />}
              </div>
            </>
          );
        })
      ) : (
        <option value=""></option>
      )}
    </div>
  );
}
