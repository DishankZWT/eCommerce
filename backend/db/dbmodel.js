require("dotenv").config();

dbname = process.env.TEST_DATABASE;
admin = process.env.MYSQL_USER;
password = process.env.MYSQL_PASSWORD;

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbname, admin, password, {
  dialect: "mysql",
  freezeTableName: true,
});

//sequelize model for users table
const users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "customer"),
      defaultValue: "customer",
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "unique_email_index",
      },
    ],
  }
);

//sequelize model for categories table
const categories = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["name"],
        name: "unique_name_index",
      },
    ],
  }
);

//sequelize model for products table
const products = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
  }
);

//sequelize model for cart table
const cart = sequelize.define(
  "cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    freezeTableName: true,
  }
);

//sequelize model for wishlist table
const wishlist = sequelize.define(
  "wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

//sequelize model for orders table (optional)
const orders = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(["pending", "shipped", "delivered", "canceled"]),
      defaultValue: "pending",
    },
  },
  {
    freezeTableName: true,
  }
);

//sequelize model for order_items table (optional)
const order_items = sequelize.define(
  "order_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

//sequelize assossiations

users.hasOne(cart, { foreignKey: "user_id", onDelete: "CASCADE" });
cart.belongsTo(users, { foreignKey: "user_id" });

users.hasOne(wishlist, { foreignKey: "users_id", onDelete: "CASCADE" });
wishlist.belongsTo(users, { foreignKey: "users_id" });

categories.hasMany(products, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
products.belongsTo(categories, { foreignKey: "category_id" });

cart.belongsTo(products, { foreignKey: "product_id", onDelete: "CASCADE" });
products.hasMany(cart, { foreignKey: "product_id" });

wishlist.belongsTo(products, { foreignKey: "product_id", onDelete: "CASCADE" });
products.hasMany(wishlist, { foreignKey: "product_id" });

orders.belongsTo(users, { foreignKey: "user_id" });
users.hasMany(orders, { foreignKey: "user_id", onDelete: "CASCADE" });

order_items.belongsTo(orders, { foreignKey: "order_id" });
orders.hasMany(order_items, { foreignKey: "order_id", onDelete: "CASCADE" });

order_items.belongsTo(products, { foreignKey: "product_id" });
products.hasMany(order_items, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

// sequelize
//   .sync({ force: true })
//   .then()
//   .catch((err) => console.log(err));

sequelize
  .authenticate()
  .then()
  .catch((err) => console.log(err));

module.exports = {
  users,
  products,
  categories,
  cart,
  wishlist,
  orders,
  order_items,
};
