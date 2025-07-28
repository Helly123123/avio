const jwt = require("jsonwebtoken");
require("dotenv").config();

async function decodeAndVerifyJWT(token) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return {
      success: true,
      data: jwt.verify(token, process.env.JWT_SECRET),
    };
  } catch (error) {
    return {
      success: false,
    };
    return null;
  }
}

function getUserIdFromToken(token) {
  const decoded = decodeAndVerifyJWT(token);
  return decoded?.uuid || null;
}

function getUserEmailFromToken(token) {
  const decoded = decodeAndVerifyJWT(token);
  return decoded?.email || null;
}

module.exports = {
  decodeAndVerifyJWT,
  getUserIdFromToken,
  getUserEmailFromToken,
};
