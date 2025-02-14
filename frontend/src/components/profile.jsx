import "./profile.css";
import Card from "./cards/card";
import UpdateProfileForm from "./updateProfile";
import { useEffect, useState } from "react";

export default function Profile() {
  const [activeForm, setActiveForm] = useState(null);
  const [data, setData] = useState(null);

  const handleLinkClick = (formType) => {
    setActiveForm(formType);
  };

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:3000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((profile) => setData(profile))
      .catch((error) => console.error("Error:", error));
  }

  return (
    <>
      <div className="profile">
        {data ? (
          <>
            <p>first name: {data.first_name}</p>
            <p>last name: {data.last_name}</p>
            <p>email: {data.email}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <a href="#" onClick={() => handleLinkClick("update-profile")}>
        <Card name="Update Profile"></Card>
      </a>
      <div className="formDiv">
        {activeForm === "update-profile" && (
          <UpdateProfileForm getUser={getUser} />
        )}
      </div>
    </>
  );
}
