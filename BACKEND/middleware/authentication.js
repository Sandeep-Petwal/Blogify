const jwt = require('jsonwebtoken');
const secret = process.env.PRIVATE_KEY || "sandeepprasadpetwal51";
const User = require("../models/userModel");

// user auth
exports.authentication = (req, res, next) => {
    const token = req.headers['token'];
    console.log("\nInside the auth middleware ");
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.log("token verifying fail  ❌");
            return res.sendStatus(403);
        }
        req.user = user;
        console.log("Successfully verified by authJwt middleware ✅!");
        next();
    })
}

// admin auth
exports.adminAuth = async (req, res, next) => {
    console.log("\nInside admin auth middleware \n");
    const token = req.headers['token'];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });

        const { user_id } = user;
        const foundUser = await User.findOne({ where: { user_id } });

        if (!foundUser || foundUser.role !== 'admin') {
            console.log("Not an admin !");
            return res.status(403).json({ message: "Access denied: not an admin" });
        }

        console.log("Successfully verified Admin !");
        req.user = user;
        next();
    } catch (error) {
        console.log("Error verifying token: ", error);
        return res.status(403).json({ message: "Invalid token" });
    }
};
