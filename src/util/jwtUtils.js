const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
    const payload = userId ;
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust the expiration as needed
    return token;
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
