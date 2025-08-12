const isUserLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
export default isUserLoggedIn;
