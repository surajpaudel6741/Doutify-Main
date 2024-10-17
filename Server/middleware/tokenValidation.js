const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        // console.log(token)
        jwt.verify(token, process.env.SECRET_KEY , (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);  // Log the error for debugging
                res.status(401);
                return res.json({ message: "You are not authorized" , _token: token, authentication: false });
            } else {
                console.log("[T] Token Validated")
                req.user = { decoded, token };  // Pass the decoded information
                next();
            }
        });
    } else { 
        res.status(401);
        console.log("Authorization header missing or invalid");
        return res.status(402).json({ message: "Authorization header missing or invalid", authentication: false });
    }
});
module.exports = validateToken;



