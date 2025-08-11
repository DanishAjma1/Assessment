import session from "express-session";
import sessionStore from "../../utils/mongoStore.js";

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000,
  },
});
export default sessionMiddleware;
