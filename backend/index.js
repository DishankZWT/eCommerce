const express = require("express");
const env = require("dotenv").config();
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.APP_PORT;
const apiRoutes = require("./routes/routes");
const { logger } = require("./utilities/logger");
app.use(logger);

app.use("/images", express.static(path.join(__dirname, "media")));
app.use("/", apiRoutes);
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
