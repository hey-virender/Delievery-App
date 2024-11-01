import jwt from "jsonwebtoken";

// Secret Keys (Should be stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-secure-secret"; // For access tokens
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-secure-refresh-secret"; // For refresh tokens

// Token Expiration Times


// Generate JWT Access Token
export const generateAccessToken = (uid, phone) => {
  const payload = {
    uid, // User ID
    phone, // User's phone number
  };

  const token = jwt.sign(payload, JWT_SECRET,);

  return token;
};




// Verify JWT Access Token
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Return the decoded payload if the token is valid
  } catch (error) {
    return false; // If the token is invalid or expired, return false
  }
};

// Verify JWT Refresh Token


