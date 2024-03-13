const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretKey = process.env.JWT_SECRET;

const authenticate = (request, response, next) => {
    const accessToken = request.headers['authorization'];
    if (!accessToken) {
      return response.status(401).json('Access Denied. No token provided.');
    }
  
    try {
      // console.log(' authenticate token : ', accessToken, '  secretKey : ', secretKey)
      const decoded = jwt.verify(accessToken, secretKey);
      request.user = decoded.userId;
      next();
    } catch (error) {
      return response.status(400).json('Token invalide.');
    }
  };

  module.exports = authenticate