const fs = require("fs");

function logger(req, res, next) {
  let temp = req.method + " " + req.url + " " + new Date() + "\n";
  console.log(temp);

  fs.appendFile("logs.txt", temp, () => {
    temp = "log added successfully";
    console.log(temp);
    next();
  });
}

module.exports = { logger };
