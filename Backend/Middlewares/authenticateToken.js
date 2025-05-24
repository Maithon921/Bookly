import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const authHeader = req.headers?.authorization;

  if (!authHeader && !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}

export default authenticateToken;
