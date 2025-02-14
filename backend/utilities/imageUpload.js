const imageUpload = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(402).json({ message: `invalid role` });
  }
};

module.exports = imageUpload;
