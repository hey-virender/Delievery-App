import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

// Middleware to verify Access Token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.userId = decoded.uid;
    req.phone = decoded.phone;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to handle Refresh Token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(decoded.userId, decoded.phone);

    // Send the new access token in the response
    res.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ error: "Failed to refresh access token" });
  }
};
