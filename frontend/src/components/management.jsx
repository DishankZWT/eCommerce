import { useState } from "react";
import AddCategoryForm from "./adminControl/createCategory";
import AddProductForm from "./adminControl/createProduct";
import GetAllUsersForm from "./adminControl/getUsers";
import UpdateProductForm from "./adminControl/updateProduct";
import DeleteProductForm from "./adminControl/deleteProduct";
import UpdateOrderForm from "./adminControl/updateOrderForm";
import Card from "./cards/card";

export default function Management() {
  const [activeForm, setActiveForm] = useState(null);

  const handleLinkClick = (formType) => {
    setActiveForm(formType);
  };
  return (
    <>
      <div className="management-cards">
        <a href="#" onClick={() => handleLinkClick("updateProduct")}>
          <Card name="update product"></Card>
        </a>
        <a href="#" onClick={() => handleLinkClick("deleteProduct")}>
          <Card name="delete product"></Card>
        </a>
        <a href="#" onClick={() => handleLinkClick("users")}>
          <Card name="get users"></Card>
        </a>
        <a href="#" onClick={() => handleLinkClick("updateOrder")}>
          <Card name="update order"></Card>
        </a>
        <a href="#" onClick={() => handleLinkClick("product")}>
          <Card name="create product"></Card>
        </a>
        <a href="#" onClick={() => handleLinkClick("category")}>
          <Card name="create category"></Card>
        </a>
      </div>

      <div>
        {activeForm === "updateOrder" && <UpdateOrderForm />}
        {activeForm === "updateProduct" && <UpdateProductForm />}
        {activeForm === "deleteProduct" && <DeleteProductForm />}
        {activeForm === "product" && <AddProductForm />}
        {activeForm === "category" && <AddCategoryForm />}
        {activeForm === "users" && <GetAllUsersForm />}
      </div>
    </>
  );
}
