export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access denied. You do not have permissions to perform this action.'
  });
};
