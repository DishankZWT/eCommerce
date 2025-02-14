/* eslint-disable react/prop-types */
import { useState } from "react";

export default function UpdateProfileForm({ getUser }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ first_name, last_name, email, password }),
      });
      await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        getUser();
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Error occurred while updating profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Update Profile</h3>
      {message && <p className="message">{message}</p>}
      <br />
      <div>
        <label>First Name</label>
        <input
          type="text"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );
}
