// ============================================================
// TEMPLATE: Agar tumhare project me pehle se admin-auth middleware hai
// to ye file mat use karo. routes/adRoutes.js me apna middleware import kar do.
//
// Ye template Authorization: Bearer <JWT> check karta hai aur
// token me role === "admin" (ya isAdmin === true) hona chahiye.
// Apne token ke hisaab se neeche wali condition badal lena.
// ============================================================
const jwt = require("jsonwebtoken");

module.exports = function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isAdmin = decoded.role === "admin" || decoded.isAdmin === true;

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Admin only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};