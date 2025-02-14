import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="home">
      {data ? (
        <div>
          <h1>{data.message}</h1>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
