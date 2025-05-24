function checkAdmin(req, res, next) {
  if (req.user?.isAdmin) {
    return next();
  }
  return res.status(403).json({message: "Access denied: Admin only"});
}

export default checkAdmin;
