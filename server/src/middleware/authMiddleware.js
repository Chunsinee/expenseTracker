const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  // Check Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.user) {
      return res.status(401).json({ message: "Token payload invalid" });
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
