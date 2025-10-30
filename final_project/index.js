const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })) // Hardcoding secret for simplicity
app.use("/customer/auth/*", async function auth(req, res, next) {
    try {
        const {user, token} = req.session;
        jwt.verify(token, "token_secret", (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token error, try again" });
            }
            next();
        })
    } catch (err) {
        return res.status(401).json({ message: "User unauthenticated, please login" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
