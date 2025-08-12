import session from "express-session";
import sessionStore from "../../utils/mongoStore.js";
const secret= process.env.SESSION_SECRET;

const sessionMiddleware = session({
  secret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 36000000,
  },
});
export default sessionMiddleware;
