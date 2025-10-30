const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })) // Hardcoding secret for simplicity
app.use("/customer/auth/*", async function auth(req, res, next) {
    try {
        const {user, token} = req.session;
        jwt.verify(token, "token_secret", (err, decoded) => {
            if (err) {
                return return res.status(401).json({ message: "Token error, try again" });
            }
            next();
        })
    } catch (err) {
        return res.status(401).json({ message: "User unauthenticated, please login" });
    }
});
// app.use("/customer/auth/login", function auth(req, res, next) {
//     try {
//         const { username, password } = req.body;
//         const success = String(users[username]?.password) === String(password);
//         if (success) {                      // hardcoding secret for simpicity
//             req.session.token = jwt.sign({ username }, "token_secret", { expiresIn: 60 * 60 });
//             req.session.user = { username };
//             return res.status(200).json({ message: "Logged in successfully" })
//         }
//         else {
//             return res.status(401).json({ message: "Incorrect credentials, try again" });
//         }
//     } catch (err) {
//         return res.status(401).json({ message: "Error logging in, try later" });
//     }

// });
// app.use("/customer/auth/register", function auth(req, res, next) {
//     try {
//         const { username, password } = req.body;
//         const isAvailable = !users[username];
//         if (isAvailable) {                      // hardcoding secret for simpicity
//             req.session.token = jwt.sign({ username }, "token_secret", { expiresIn: 60 * 60 });
//             req.session.user = { username };
//             users[username] = { password };
//             return res.status(200).json({ message: "Logged in successfully" })
//         }
//         else {
//             return res.status(401).json({ message: "Username is taken, choose another" });
//         }
//     } catch (err) {
//         return res.status(401).json({ message: "Error signing up, try later" });
//     }
// });

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
