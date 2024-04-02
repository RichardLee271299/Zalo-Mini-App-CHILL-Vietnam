// Middleware kiểm tra xem người dùng đã đăng nhập chưa trước khi truy cập vào tài nguyên bảo vệ
module.exports = function requireLogin(req, res, next) {
  if (!req.session.loggedIn && !req.path.startsWith('/api') && req.path !== '/login') {
    return res.redirect('/login'); // Chuyển hướng lại trang đăng nhập nếu chưa đăng nhập
  }
  next();
}